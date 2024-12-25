import React from "react";
import { StyleSheet, Text, View } from "react-native";

const SavedPostsTab: React.FC = () => {
  return (
    <View style={styles.savedPostContainer}>
      <Text style={styles.noPostText}>No Saved Posts Right Now...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  savedPostContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  noPostText: {
    fontSize: 14,
    fontFamily: "Oxygen_Regular",
  },
});

export default SavedPostsTab;
