import { ActivityIndicator, StyleSheet, Text, View, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Header from "@/components/Header";
import SearchBar from "@/components/SearchBar";
import { NewsDataType } from "@/types";
import axios from "axios";
import BreakingNews from "@/components/BreakingNews";
import Categories from "@/components/Categories";
import NewsList from "@/components/NewsList";
import Loading from "@/components/Loading";

const Page = () => {
  const { top: safeTop } = useSafeAreaInsets();
  const [breakingNews, setBreakingNews] = useState<NewsDataType[]>([]);
  const [news, setNews] = useState<NewsDataType[]>([]);
  const [isBreakingNewsLoading, setIsBreakingNewsLoading] = useState(true);
  const [isNewsLoading, setIsNewsLoading] = useState(false); // ✅ Separate loading for NewsList

  useEffect(() => {
    getBreakingNews();
    getNews();
  }, []);

  const getBreakingNews = async () => {
    try {
      setIsBreakingNewsLoading(true);
      const API_KEY = "pub_674630a373aa7c17c15701bbd148f34cae62e";
      if (!API_KEY) {
        console.error("Missing API Key! Check your environment variables.");
        return;
      }

      const URL = `https://newsdata.io/api/1/news?apikey=${API_KEY}&country=id&language=en&image=1&removeduplicate=1&size=5`;
      const response = await axios.get(URL);

      if (response.data?.results) {
        setBreakingNews(response.data.results);
      }
    } catch (error: any) {
      console.log(`Error fetching breaking news: ${error.message}`);
    } finally {
      setIsBreakingNewsLoading(false);
    }
  };

  const getNews = async (category: string = "") => {
    try {
      setIsNewsLoading(true); // ✅ Only news list triggers loading
      const API_KEY = "pub_674630a373aa7c17c15701bbd148f34cae62e";
      if (!API_KEY) {
        console.error("Missing API Key! Check your environment variables.");
        return;
      }

      let categoryString ='';
      if(category.length!==0){
        categoryString=`&category=${category}`
      }
      const URL = `https://newsdata.io/api/1/news?apikey=${API_KEY}&country=id&language=en&image=1&removeduplicate=1&size=10${categoryString}`;
      console.log(URL);
      const response = await axios.get(URL);
console.log(URL);
      if (response.data?.results) {
        setNews(response.data.results);
      }
    } catch (error: any) {
      console.log(`Error fetching news: ${error.message}`);
    } finally {
      setIsNewsLoading(false);
    }
  };

  const onCatChanged = (category: string) => {
    console.log(`Category: ${category}`);
    setNews([]); // ✅ Clear news before fetching new data
    getNews(category);
  };

  return (
    <ScrollView style={[styles.container, { paddingTop: safeTop }]}>
      <Header />
      <SearchBar />
      
      {/* ✅ Breaking News will NOT re-render when category changes */}
      {isBreakingNewsLoading ? <Loading size="large" /> : <BreakingNews newsList={breakingNews} />}

      <Categories onCategoryChanged={onCatChanged} />
      
      {/* ✅ Only NewsList reloads when category changes */}
      {isNewsLoading ? <Loading size="large" /> : <NewsList newsList={news} />}
    </ScrollView>
  );
};

export default Page;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  newsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  noNewsText: {
    fontSize: 14,
    color: "gray",
    textAlign: "center",
    marginTop: 20,
  },
});
