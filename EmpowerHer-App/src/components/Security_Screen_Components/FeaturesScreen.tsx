import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  BackHandler,
  ActivityIndicator,
} from "react-native";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store/store";
import { setCurrentFeature } from "../../contexts/securityFeatureSlice";
import { SecurityScreenType } from "../../types/types";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Entypo from "@expo/vector-icons/Entypo";
import Ionicons from "@expo/vector-icons/Ionicons";
import { setCurrentScreen } from "../../contexts/screenSlice";
import { useFonts } from "expo-font";

const FeaturesScreen = () => {
  const dispatch = useDispatch<AppDispatch>();

  const [fontsLoaded] = useFonts({
    Rowdies_Bold: require("../../../assets/Fonts/Rowdies-Bold.ttf"),
    Tajwal_Medium: require("../../../assets/Fonts/Tajawal-Medium.ttf"),
    Kanit_Medium: require("../../../assets/Fonts/Kanit-Medium.ttf"),
    Kanit_Light: require("../../../assets/Fonts/Kanit-Light.ttf"),
  });

  useEffect(() => {
    const backAction = () => {
      dispatch(setCurrentScreen("home"));
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  const handlePress = (security: SecurityScreenType) => {
    dispatch(setCurrentFeature(security));
  };

  // Show a loading indicator while fonts are loading
  if (!fontsLoaded) {
    return <ActivityIndicator size="large" color="#9067c6" />;
  }

  return (
    <View style={styles.featureScreenContainer}>
      {/* Rakshita Heading */}
      <View style={styles.headerContainer}>
        <Ionicons name="shield-checkmark-outline" size={36} color="#9067c6" />
        <Text style={styles.headerText}>Rakshita</Text>
      </View>
      <Text style={styles.taglineText}>
        Empowered & Safeguarded by Nirbhaya
      </Text>
      <Text style={styles.subTaglineText}>
        Your Trusted Companion for Safety
      </Text>

      {/* Features List */}
      <View style={styles.featureContainer}>
        <TouchableOpacity
          style={styles.featureButton}
          onPress={() => handlePress("sosBtn")}
        >
          <MaterialCommunityIcons
            name="car-emergency"
            size={24}
            color="white"
          />
          <Text style={styles.featureBtn}>SOS Button</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.featureContainer}>
        <TouchableOpacity
          style={styles.featureButton}
          onPress={() => handlePress("incidentReporting")}
        >
          <FontAwesome5 name="edit" size={24} color="white" />
          <Text style={styles.featureBtn}>Incident Reporting</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.featureContainer}>
        <TouchableOpacity
          style={styles.featureButton}
          onPress={() => handlePress("safetyTimer")}
        >
          <Entypo name="time-slot" size={24} color="white" />
          <Text style={styles.featureBtn}>Safety Timer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default FeaturesScreen;

const styles = StyleSheet.create({
  featureScreenContainer: {
    alignContent: "center",
    justifyContent: "center",
    flex: 1,
    paddingHorizontal: 20,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 3,
  },
  headerText: {
    fontFamily: "Rowdies_Bold",
    fontSize: 28,
    color: "#9067c6",
    marginLeft: 10,
  },
  taglineText: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
    color: "#9067c6",
    marginTop: 5,
    fontFamily: "Kanit_Medium",
  },
  subTaglineText: {
    textAlign: "center",
    fontSize: 14,
    color: "#9067c6",
    marginBottom: 20,
    fontFamily: "Kanit_Light",
  },
  featureContainer: {
    margin: 10,
    padding: 40,
    backgroundColor: "#9067c6",
    borderRadius: 10,
  },
  featureButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  featureBtn: {
    fontSize: 22,
    color: "#fff",
    marginLeft: 10,
    fontFamily: "Tajwal_Medium",
  },
});
