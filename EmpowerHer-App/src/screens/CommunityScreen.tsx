import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  BackHandler,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store/store";
import { setCurrentScreen } from "../contexts/screenSlice";
import { addPost } from "../contexts/userSlice";
import { getAllPosts } from "../services/firebase/communityScreen.services";
import Post from "../components/Community_Screen_Components/Post";
import { PostType } from "../types/types";
import { useFonts } from "expo-font";

const CommunityScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [posts, setPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState(true);

  const [fontsLoaded] = useFonts({
    Tajawal_Bold: require("../../assets/Fonts/Tajawal-Bold.ttf"),
    Oxygen_Regular: require("../../assets/Fonts/Oxygen-Regular.ttf"),
  });

  // Fetch posts from Firestore
  useEffect(() => {
    getAllPosts()
      .then((response) => {
        setPosts(response);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Handle back button press to navigate to "info" screen
  useEffect(() => {
    const backAction = () => {
      dispatch(setCurrentScreen("info"));
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [dispatch]);

  if (!fontsLoaded) {
    return <ActivityIndicator size="large" color="#9067c6" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Community</Text>
      <Text style={styles.subHeader}>
        Here, you'll receive updates on opportunities and activities within the
        community.
      </Text>

      {loading ? (
        <Text>Please Wait Posts are Loading...</Text>
      ) : (
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          {posts.length > 0 ? (
            posts.map((post) => (
              <Post
                key={post.id}
                post={post}
                onSave={() => {
                  addPost(post);
                }}
              />
            ))
          ) : (
            <Text style={styles.noPostsText}>No posts available.</Text>
          )}
        </ScrollView>
      )}
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#FBF7FC",
    marginBottom: 50,
  },
  header: {
    fontSize: 24,
    color: "#7A4791",
    marginBottom: 8,
    textAlign: "center",
    fontFamily: "Tajawal_Bold",
  },
  subHeader: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginBottom: 16,
    fontFamily: "Oxygen_Regular",
  },
  scrollView: {
    flex: 1,
    marginTop: 8,
  },
  noPostsText: {
    textAlign: "center",
    fontSize: 16,
    color: "#888",
    marginTop: 20,
  },
});

export default CommunityScreen;
