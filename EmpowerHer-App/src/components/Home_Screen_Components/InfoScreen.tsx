import React, { useState } from "react";
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Image,
  Alert,
  ActivityIndicator,
  ToastAndroid,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import * as Location from "expo-location";
import io from "socket.io-client";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "../../store/store";
import { RootState } from "../../store/store";
import AppData from "../../../assets/AppAssets.json";
import { saveSOSButtonReport } from "../../services/firebase/securityScreen.services";
import { SOSButtonReportInfomation } from "../../types/types";
import { sendSmsWithLocation } from "../../utils/notifications.utils";
import { TEST_NUMBER, TEST_NUMBER2, RAKSHITA_SERVER } from "@env";
import {
  setCurrentScreen,
  setEmergencyState,
} from "../../contexts/screenSlice";
import { useFonts } from "expo-font";

const { width, height } = Dimensions.get("window");
const socket = io(RAKSHITA_SERVER);

const InfoScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.appUser.user);
  const username = useSelector((state: RootState) => state.appUser.user?.name);
  const SOSButtonContacts = useSelector(
    (state: RootState) => state.securityFeature.SOSButtonContacts
  );
  const [loading, setLoading] = useState(false);

  const [fontsLoaded] = useFonts({
    Rowdies_Bold: require("../../../assets/Fonts/Rowdies-Bold.ttf"),
    Tajawal_Regular: require("../../../assets/Fonts/Tajawal-Regular.ttf"),
    Tajawal_Medium: require("../../../assets/Fonts/Tajawal-Medium.ttf"),
    Tajawal_Bold: require("../../../assets/Fonts/Tajawal-Bold.ttf"),
    Oxygen_Regular: require("../../../assets/Fonts/Oxygen-Regular.ttf"),
    Oxygen_Bold: require("../../../assets/Fonts/Oxygen-Bold.ttf"),
  });

  const handleEmergency = () => {
    setLoading(true);

    Location.requestForegroundPermissionsAsync()
      .then(({ status }) => {
        if (status !== "granted") {
          Alert.alert(
            "Location Permission Denied",
            "Please enable location services to use the SOS feature."
          );
          setLoading(false);
          return Promise.reject("Location permission denied");
        }

        return Location.getCurrentPositionAsync({});
      })
      .then(async (location) => {
        const locationLink = `https://maps.google.com/?q=${location.coords.latitude},${location.coords.longitude}`;

        const SOSButtonReport: SOSButtonReportInfomation = {
          reportedBy: user?.uid || "anonymous",
          status: "pending",
          reportedAt: new Date(),
          location: locationLink,
        };

        const { reportId } = await saveSOSButtonReport(SOSButtonReport);

        // 1. Emit SOS
        socket.emit("sos", { reportId });

        // 2. SMS Functionality
        sendSmsWithLocation(
          TEST_NUMBER,
          username || "User",
          locationLink,
          "sos"
        )
          .then(() => {
            console.log("SMS sent to test number");
          })
          .catch((error) => {
            console.error("Error sending SMS to test number:", error);
          });

        sendSmsWithLocation(
          TEST_NUMBER2,
          username || "User",
          locationLink,
          "sos"
        )
          .then(() => {
            console.log("SMS sent to test number");
          })
          .catch((error) => {
            console.error("Error sending SMS to test number:", error);
          });

        ToastAndroid.showWithGravity(
          "Moving to the next screen for further assistance.",
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM
        );

        setTimeout(() => {
          dispatch(setEmergencyState(true));
          dispatch(setCurrentScreen("emergency"));
        }, 5000);
      })
      .catch((error) => {
        console.error("Error handling emergency:", error);
        Alert.alert("Error", "Could not send SOS report. Please try again.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  if (!fontsLoaded) {
    return <ActivityIndicator size="large" color="#9067c6" />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>Welcome</Text>
            <Text style={styles.nameText}>{username || "User"}</Text>
          </View>
          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => dispatch(setCurrentScreen("settings"))}
          >
            <Feather name="user" size={24} color="#8A2BE2" />
          </TouchableOpacity>
        </View>

        {/* Emergency Section */}
        <View style={styles.emergencyContainer}>
          <View style={styles.textImageContainer}>
            <Text style={styles.emergencyText}>
              If you're in an emergency or facing a dangerous situation, press
              the button below. The nearest Nirbhaya Squad will be alerted and
              will reach you promptly. Additionally, if you've saved trusted
              contacts in the Security section, they will receive a message with
              your location.
            </Text>
            <Image
              source={{ uri: AppData.homePageSOSImage }}
              style={styles.sosImage}
            />
          </View>
          <TouchableOpacity style={styles.sosButton} onPress={handleEmergency}>
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.sosButtonText}>I Need Help !!!</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FBF7FC",
    paddingHorizontal: width * 0.04,
    paddingTop: height * 0.01,
    paddingBottom: height * 0.04,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.02,
    borderBottomWidth: 1,
    borderBottomColor: "#F0E6FF",
    marginBottom: height * 0.02,
  },
  welcomeText: {
    fontSize: width * 0.04,
    color: "#888",
    fontFamily: "Tajawal_Regular",
  },
  nameText: {
    fontSize: width * 0.045,
    color: "#333",
    marginTop: 4,
    fontFamily: "Rowdies_Bold",
  },
  profileButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#F0E6FF",
    justifyContent: "center",
    alignItems: "center",
  },
  emergencyContainer: {
    backgroundColor: "#f0eff4",
    borderRadius: 10,
    padding: width * 0.04,
    elevation: 4,
    marginVertical: height * 0.02,
  },
  textImageContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: height * 0.02,
  },
  emergencyText: {
    flex: 1,
    fontSize: width * 0.035,
    color: "#333",
    marginRight: width * 0.04,
    fontFamily: "Oxygen_Regular",
  },
  sosImage: {
    width: 150,
    height: 150,
  },
  sosButton: {
    backgroundColor: "#f75252",
    alignSelf: "center",
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.1,
    borderRadius: 5,
    marginTop: height * 0.01,
  },
  sosButtonText: {
    color: "#FFF",
    fontSize: width * 0.04,
    fontFamily: "Tajawal_Medium",
  },
});

export default InfoScreen;
