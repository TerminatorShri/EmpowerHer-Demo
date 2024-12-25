import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { PostType } from "../../types/types";
import { useFonts } from "expo-font";

type PostProps = {
  post: PostType;
  onSave: () => void; // Include the onSave function in the props
};

const Post = ({ post, onSave }: PostProps) => {
  // Destructure onSave here
  const [fontsLoaded] = useFonts({
    Tajawal_Bold: require("../../../assets/Fonts/Tajawal-Bold.ttf"),
    Fredoka_Regular: require("../../../assets/Fonts/Fredoka-Regular.ttf"),
    Oxygen_Regular: require("../../../assets/Fonts/Oxygen-Regular.ttf"),
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: post.photoUrl }} style={styles.avatar} />
        <View>
          <Text style={styles.name}>{post.postedBy}</Text>
        </View>
        <Feather
          name="more-vertical"
          size={24}
          color="black"
          style={styles.moreIcon}
        />
      </View>
      <Text style={styles.content}>{post.desc}</Text>
      <Image source={{ uri: post.photoUrl }} style={styles.postImage} />
      <View style={styles.footer}>
        <View style={styles.category}>
          <Text style={styles.categoryText}>{post.category}</Text>
        </View>
        <TouchableOpacity style={styles.saveButton} onPress={onSave}>
          <Feather name="bookmark" size={24} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Post;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f0eff4",
    borderRadius: 10,
    padding: 16,
    margin: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  name: {
    fontSize: 16,
    fontFamily: "Tajawal_Bold",
  },
  moreIcon: {
    marginLeft: "auto",
  },
  content: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
    fontFamily: "Fredoka_Regular",
  },
  postImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 12,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  category: {
    backgroundColor: "#7A4791",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  categoryText: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "Oxygen_Regular",
  },
  saveButton: {
    padding: 8,
    borderRadius: 30,
    backgroundColor: "#f0f0f0",
  },
});
