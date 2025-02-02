import { ActivityIndicator, Image, StyleSheet, Text, View, ScrollView } from "react-native";
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
import { GestureHandlerRootView, TouchableOpacity } from "react-native-gesture-handler";
import { useRouter } from "expo-router";

const Page = () => {
    const router = useRouter();
  const { top: safeTop } = useSafeAreaInsets();
  const [breakingNews, setBreakingNews] = useState<NewsDataType[]>([]);
  const [news, setNews] = useState<NewsDataType[]>([]);
  const [isBreakingNewsLoading, setIsBreakingNewsLoading] = useState(true);
  const [isNewsLoading, setIsNewsLoading] = useState(false);

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

  const getNews = async (term:string="apple",category: string = "") => {
    try {
      let categoryString='';
      if(category!==""){
        categoryString=`&media=${category}`
      }
      setIsNewsLoading(true);

      const URL = `https://itunes.apple.com/search?term=${term}${categoryString}`;
      console.log(`Fetching news from: ${URL}`);

      const response = await axios.get(URL);

      if (response.data?.results && Array.isArray(response.data.results)) {
        setNews(response.data.results);
      } else {
        console.warn("Unexpected API response structure:", response.data);
        setNews([]);
      }
    } catch (error: any) {
      console.error(`Error fetching news: ${error.message}`);
    } finally {
      setIsNewsLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    console.log(`Searching for: ${query}`);
    // setSearchQuery(query);
    setNews([]);
    getNews(query);
  };

  const onCatChanged = (category: string) => {
    console.log(`Category: ${category}`);
    setNews([]);
    getNews(category);
  };

  return (
    <ScrollView style={[styles.container, { paddingTop: safeTop }]}>
      <Header />
      <SearchBar onSearch={handleSearch}/>

      {isBreakingNewsLoading ? <Loading size="large" /> : <BreakingNews newsList={breakingNews} />}

      <Categories onCategoryChanged={onCatChanged} />
      <GestureHandlerRootView style={{ flex: 1 }}>
      {news.map((e, index) => {
        const imageUrl = e.artworkUrl100 || "https://via.placeholder.com/160";
        const description = e.description || e.shortDescription || "No description available";

        return (
          <TouchableOpacity onPress={() => {
            const itemId = e.trackId || e.collectionId || e.id;
            console.log(itemId);
            router.push(`/news/${itemId}`)
          }}>
            <View key={index} style={styles.newsItem}>
            <View style={styles.newsContent}>
              <Image source={{ uri: imageUrl }} style={styles.newsImage} />
              <View style={styles.textContainer}>
                <Text style={styles.newsTitle}>{e.wrapperType}</Text>
                <Text style={styles.newsDescription} numberOfLines={2} ellipsizeMode="tail">
                  {description}
                </Text>
              </View>
            </View>
          </View>
          </TouchableOpacity>
        );
      })}
      </GestureHandlerRootView>
    </ScrollView>
  );
};

export default Page;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  newsItem: {
    height: 90,
    marginBottom: 30,
    marginHorizontal: 14,
  },
  newsContent: {
    flexDirection: "row",
    gap: 10,
  },
  newsImage: {
    width: 120,
    height: 80,
    backgroundColor: "red",
    marginBottom: 20,
  },
  textContainer: {
    flex: 1,
  },
  newsTitle: {
    fontSize: 17,
    fontWeight: "bold",
  },
  newsDescription: {
    fontSize: 12,
    fontWeight: "300",
  },
});
