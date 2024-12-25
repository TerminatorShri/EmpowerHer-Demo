import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ToastAndroid,
  Vibration,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  TextInput,
  BackHandler,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import * as Location from "expo-location";
import io, { Socket } from "socket.io-client";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "../../store/store";
import { RootState } from "../../store/store";
import {
  setCurrentScreen,
  setEmergencyState,
} from "../../contexts/screenSlice";
import { RAKSHITA_SERVER, TEST_NUMBER } from "@env";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import { sendSmsWithLocation } from "../../utils/notifications.utils";
import { useFonts } from "expo-font";

const socket = io(RAKSHITA_SERVER);

const EmergencyScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const scrollViewRef = useRef<ScrollView>(null);

  const [messages, setMessages] = useState<string[]>([]);
  const [locationLoading, setLocationLoading] = useState(false);
  const [message, setMessage] = useState("");
  const username = useSelector((state: RootState) => state.appUser.user?.name);
  const user = useSelector((state: RootState) => state.appUser.user);

  let locationInterval: NodeJS.Timeout | null = null;

  const [fontsLoaded] = useFonts({
    Rowdies_Bold: require("../../../assets/Fonts/Rowdies-Bold.ttf"),
    Tajawal_Regular: require("../../../assets/Fonts/Tajawal-Regular.ttf"),
    Tajawal_Medium: require("../../../assets/Fonts/Tajawal-Medium.ttf"),
    Tajawal_Bold: require("../../../assets/Fonts/Tajawal-Bold.ttf"),
    Oxygen_Regular: require("../../../assets/Fonts/Oxygen-Regular.ttf"),
    Oxygen_Bold: require("../../../assets/Fonts/Oxygen-Bold.ttf"),
  });

  useEffect(() => {
    const newSocket = io(RAKSHITA_SERVER);

    newSocket.on("receiveMessageFromWeb", (data) => {
      Vibration.vibrate(1000);
      setMessages((prevMessages) => [...prevMessages, `Help: ${data.message}`]);
    });

    newSocket.on("receiveEndConversationNotification", () => {
      Alert.alert("End of Support Session", "Your Support Session has ended.");
      dispatch(setEmergencyState(false));
      dispatch(setCurrentScreen("info"));
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    locationInterval = setInterval(() => {
      sendLocationToServer();
    }, 5000);

    return () => {
      if (locationInterval) clearInterval(locationInterval);
    };
  }, []);

  useEffect(() => {
    const backAction = () => {
      Alert.alert(
        "Exit Emergency Screen",
        "Are you sure you want to exit? Doing so will disconnect you from the Nirbhaya Squad and may interrupt your Support Session.",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Yes",
            onPress: () => {
              dispatch(setEmergencyState(false));
              dispatch(setCurrentScreen("info"));
            },
          },
        ]
      );
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => {
      backHandler.remove();
      if (socket) {
        socket.disconnect();
        console.log("Socket disconnected on component unmount");
      }
    };
  }, []);

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const sendLocationToServer = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Location Permission Denied",
          "Please enable location services."
        );
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const locationLink = `${location.coords.latitude},${location.coords.longitude}`;

      console.log(locationLink);

      socket?.emit("updatedLocation", {
        location: locationLink,
      });

      console.log("Location sent to the server.");
    } catch (error) {
      console.error("Error sending location:", error);
    }
  };

  const handleSafe = () => {
    socket?.emit("declareSafe", { userId: user?.uid });

    if (locationInterval) clearInterval(locationInterval);

    ToastAndroid.showWithGravity(
      "Your safety is reported",
      ToastAndroid.LONG,
      ToastAndroid.BOTTOM
    );
  };

  const handleSendLocation = async () => {
    setLocationLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Location Permission Denied",
          "Please enable location services to use the SOS feature."
        );
        setLocationLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const locationLink = `https://maps.google.com/?q=${location.coords.latitude},${location.coords.longitude}`;

      await sendSmsWithLocation(
        TEST_NUMBER,
        username || "User",
        locationLink,
        "emergency"
      );

      ToastAndroid.showWithGravity(
        "Your location was sent to pre-selected contacts successfully",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM
      );
    } catch (error) {
      console.error("Error sending SMS:", error);
      Alert.alert("Error Sending Location", "Please try again later.");
    } finally {
      setLocationLoading(false);
    }
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      socket?.emit("sendMessageToWeb", { message });
      setMessages((prevMessages) => [...prevMessages, `You: ${message}`]);
      setMessage("");
    } else {
      ToastAndroid.showWithGravity(
        "Please enter a message before sending.",
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM
      );
    }
  };

  if (!fontsLoaded) {
    return <ActivityIndicator size="large" color="#9067c6" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        This is the emergency screen. You will receive updates on your
        assistance here, and you can also provide additional help to ensure a
        faster response.
      </Text>

      <ScrollView style={styles.messageContainer} ref={scrollViewRef}>
        {messages.map((msg, index) => (
          <View key={index} style={styles.messageBox}>
            <Text style={styles.messageText}>{msg}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Write your message here"
          value={message}
          onChangeText={setMessage}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
          {/* <Text style={styles.buttonText}>Send</Text> */}
          <Ionicons name="send-sharp" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.locationButton}
          onPress={handleSendLocation}
        >
          {locationLoading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>
              Send Updated Location to Saved Contacts
            </Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity style={styles.safeButton} onPress={handleSafe}>
          <View style={styles.buttonContent}>
            <Text style={styles.buttonText}>I'm Safe</Text>
            <AntDesign name="Safety" size={24} color="white" />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default EmergencyScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
    fontFamily: "Tajawal_Regular",
  },
  messageContainer: {
    marginBottom: 20,
    flex: 1,
  },
  messageBox: {
    backgroundColor: "#e0e0e0",
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
  },
  messageText: {
    color: "#333",
    fontFamily: "Oxygen_Regular",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    paddingTop: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    backgroundColor: "#fff",
    marginRight: 10,
    fontFamily: "Oxygen_Regular",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  sendButton: {
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  locationButton: {
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 5,
    flex: 1,
    marginHorizontal: 5,
  },
  safeButton: {
    backgroundColor: "#5ee354",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 5,
    flex: 1,
    marginHorizontal: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonContent: {
    flexDirection: "row",
    gap: 2,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontFamily: "Tajawal_Medium",
  },
});
