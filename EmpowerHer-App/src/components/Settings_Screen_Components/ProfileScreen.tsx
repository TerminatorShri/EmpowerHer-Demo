import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { useFonts } from "expo-font";
import InformationTab from "./InformationTab";
import SavedPostsTab from "./SavedPostsTab";

const ProfileScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"Information" | "Saved Posts">(
    "Information"
  );

  const user = useSelector((state: RootState) => state.appUser.user);
  const [username, setUsername] = useState<string | undefined>(user?.name);
  const [profilePicture, setProfilePicture] = useState<string | undefined>(
    user?.profilePhoto
  );

  const [fontsLoaded] = useFonts({
    Rowdies_Bold: require("../../../assets/Fonts/Tajawal-Bold.ttf"),
    Kanit_Medium: require("../../../assets/Fonts/Kanit-Medium.ttf"),
    Oxygen_Regular: require("../../../assets/Fonts/Oxygen-Regular.ttf"),
  });

  useEffect(() => {
    if (user) {
      setUsername(user.name);
      setProfilePicture(user.profilePhoto);
    }
  }, [user]);

  if (!fontsLoaded) {
    return <ActivityIndicator size="large" color="#9067c6" />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.profileCard}>
          <View style={styles.profileImageContainer}>
            <Image
              source={{
                uri:
                  profilePicture ||
                  "https://v0.dev/placeholder.svg?height=150&width=150",
              }}
              style={styles.profileImage}
            />
          </View>
          <Text style={styles.userName}>{username || "User"}</Text>
        </View>
        <View style={styles.tabContainer}>
          {["Information", "Saved Posts"].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.activeTab]}
              onPress={() => setActiveTab(tab as typeof activeTab)}
            >
              <Feather
                name={tab === "Information" ? "user" : "bookmark"}
                size={20}
                color={activeTab === tab ? "#6200ee" : "#757575"}
              />
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab && styles.activeTabText,
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {activeTab === "Information" && <InformationTab />}
        {activeTab === "Saved Posts" && <SavedPostsTab />}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FBF7FC",
    paddingBottom: 50,
  },
  profileCard: {
    backgroundColor: "#E9DEF9",
    borderRadius: 20,
    marginTop: 30,
    marginHorizontal: 20,
    padding: 20,
    alignItems: "center",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileImageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  userName: {
    fontSize: 24,
    fontFamily: "Kanit_Medium",
    color: "#333",
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#fff",
    paddingVertical: 10,
    marginTop: 20,
    marginBottom: 20,
  },
  tab: {
    flexDirection: "row",
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#6200ee",
  },
  tabText: {
    marginLeft: 5,
    color: "#757575",
    fontFamily: "Rowdies_Bold",
  },
  activeTabText: {
    color: "#6200ee",
  },
});

export default ProfileScreen;
