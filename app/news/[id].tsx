import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Image, ActivityIndicator, TouchableOpacity } from "react-native";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { GestureHandlerRootView, TouchableOpacity as GestureTouchableOpacity } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import Video from 'react-native-video'; // Video player component
import Sound from 'react-native-sound'; // Audio player library

const NewsDetail = () => {
  const { id } = useLocalSearchParams(); // Get the ID passed from the previous screen
  const [loading, setLoading] = useState(true);
  const [itemDetails, setItemDetails] = useState<any>(null);
  const [audio, setAudio] = useState<Sound | null>(null);

  useEffect(() => {
    if (id) {
      fetchItemDetails(id);
    }
  }, [id]);

  const fetchItemDetails = async (itemId: string) => {
    try {
      setLoading(true);
      const response = await axios.get(`https://itunes.apple.com/lookup?id=${itemId}`);
      const item = response.data.results[0]; // Assuming the response contains the item in results array
      setItemDetails(item);
    } catch (error) {
      console.error("Error fetching item details:", error);
    } finally {
      setLoading(false);
    }
  };

  const playAudio = (url: string) => {
    // Stop the current audio if it's playing
    if (audio) {
      audio.stop(() => {
        console.log("Previous audio stopped.");
        loadNewAudio(url);
      });
    } else {
      loadNewAudio(url);
    }
  };

  const loadNewAudio = (url: string) => {
    const newAudio = new Sound(url, null, (error) => {
      if (error) {
        console.log("Failed to load the sound", error);
        return;
      }
      newAudio.play((success) => {
        if (success) {
          console.log("Audio played successfully.");
        } else {
          console.log("Audio playback failed.");
        }
      });
      setAudio(newAudio);
    });
  };

  const isVideo = (url: string) => {
    return url.includes("mp4v") || url.includes("m3u8");
  };

  const isAudio = (url: string) => {
    return url.includes("mp3") || url.includes("aac");
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerLeft: () => (
            <GestureHandlerRootView>
              <TouchableOpacity onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={22} />
              </TouchableOpacity>
            </GestureHandlerRootView>
          ),
          headerTitle: "News Detail",
          headerTitleAlign: "center",
          headerTitleStyle: { color: "black" },
        }}
      />
      <View style={styles.container}>
        {loading ? (
          <ActivityIndicator size="large" />
        ) : (
          itemDetails && (
            <View style={styles.detailsContainer}>
              <Text style={styles.collectionName}>{itemDetails.collectionName}</Text>
              <Image
                source={{ uri: itemDetails.artworkUrl100 }}
                style={styles.artworkImage}
              />
              {itemDetails.previewUrl && (
                <>
                  {isVideo(itemDetails.previewUrl) ? (
                    <Video
                      source={{ uri: itemDetails.previewUrl }}
                      style={styles.videoPlayer}
                      controls={true}
                      resizeMode="contain"
                    />
                  ) : isAudio(itemDetails.previewUrl) ? (
                    // <TouchableOpacity onPress={() => playAudio(itemDetails.previewUrl)}>
                    //   <Text style={styles.previewUrl}>
                    //     {itemDetails.previewUrl}
                    //   </Text>
                    // </TouchableOpacity>
                    <Video
                    source={{ uri: itemDetails.previewUrl }}
                    style={styles.videoPlayer}
                    controls={true}
                    resizeMode="contain"
                  />
                  ) : (
                    <Text style={styles.previewUrl}>{itemDetails.previewUrl}</Text>
                  )}
                </>
              )}
            </View>
          )
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  detailsContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  collectionName: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  artworkImage: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  previewUrl: {
    fontSize: 14,
    color: "blue",
    marginTop: 10,
    textDecorationLine: "underline", // To show it's a clickable link
  },
  videoPlayer: {
    width: 300,
    height: 200,
    marginBottom: 20,
  },
});

export default NewsDetail;
