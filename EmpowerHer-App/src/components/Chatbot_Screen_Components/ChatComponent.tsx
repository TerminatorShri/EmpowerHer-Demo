import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  FlatList,
  BackHandler,
  Animated,
} from "react-native";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store/store";
import {
  setChatBotScreenState,
  setCurrentScreen,
} from "../../contexts/screenSlice";
import AntDesign from "@expo/vector-icons/AntDesign";
import { GEMINI_API_KEY } from "@env";
import { useFonts } from "expo-font";

type Message = {
  text: string;
  sender: "user" | "gemini";
};

const WELCOME_MESSAGE = {
  text: "👋 Hello! I'm your AI assistant. How can I help you today?",
  sender: "gemini" as const,
};

const ChatComponent = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [msg, setMsg] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const scrollY = new Animated.Value(0);

  const handleHomeIconPress = () => {
    dispatch(setCurrentScreen("info"));
    dispatch(setChatBotScreenState(false));
  };

  const headerHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [80, 60],
    extrapolate: "clamp",
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.9],
    extrapolate: "clamp",
  });

  const headerElevation = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [2, 8],
    extrapolate: "clamp",
  });

  const [fontsLoaded] = useFonts({
    Oxygen_Regular: require("../../../assets/Fonts/Oxygen-Regular.ttf"),
    Rowdies_Bold: require("../../../assets/Fonts/Rowdies-Bold.ttf"),
    Tajawal_Regular: require("../../../assets/Fonts/Tajawal-Regular.ttf"),
  });

  useEffect(() => {
    const backAction = () => {
      dispatch(setCurrentScreen("info"));
      dispatch(setChatBotScreenState(false));
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [dispatch]);

  const handleButtonClick = async () => {
    if (!msg.trim()) return;

    const userMessage: Message = { text: msg, sender: "user" };
    setMessages((prevMessages) => [userMessage, ...prevMessages]);
    setMsg("");

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: msg,
                  },
                ],
              },
            ],
          }),
        }
      );

      const data = await response.json();
      const content = data.candidates?.[0]?.content;
      const reply = content?.parts?.[0]?.text || "No response";

      const formattedReply = reply.replace(/\*/g, "");

      const geminiMessage: Message = { text: formattedReply, sender: "gemini" };
      setMessages((prevMessages) => [geminiMessage, ...prevMessages]);
    } catch (error) {
      console.error("Error:", error);
      const errorMessage: Message = {
        text: "I apologize, but I encountered an error. Could you please try again?",
        sender: "gemini",
      };
      setMessages((prevMessages) => [errorMessage, ...prevMessages]);
    }
  };

  const renderItem = ({ item }: { item: Message }) => (
    <Animated.View
      style={[
        styles.message,
        item.sender === "user" ? styles.userMessage : styles.geminiMessage,
        messages[0] === item && styles.lastMessage,
        {
          transform: [
            {
              scale: messages[0] === item ? 1 : 0.98,
            },
          ],
        },
      ]}
    >
      {item.sender === "gemini" && (
        <View style={styles.assistantIndicator}>
          <Text style={styles.assistantIcon}>🤖</Text>
        </View>
      )}
      <Text
        style={[
          styles.messageText,
          item.sender === "user"
            ? styles.userMessageText
            : styles.geminiMessageText,
        ]}
      >
        {item.text}
      </Text>
    </Animated.View>
  );

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: false }
  );

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.header,
          {
            height: headerHeight,
            opacity: headerOpacity,
            elevation: headerElevation,
          },
        ]}
      >
        <View style={styles.headerContent}>
          <Text style={styles.headerText}>Shakti</Text>
          <TouchableOpacity onPress={handleHomeIconPress}>
            <AntDesign
              name="home"
              size={24}
              color="white"
              style={styles.homeIcon}
            />
          </TouchableOpacity>
        </View>
      </Animated.View>
      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.messagesContainer}
        inverted
        onScroll={handleScroll}
        scrollEventThrottle={16}
      />
      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Ask me anything..."
            value={msg}
            onChangeText={setMsg}
            placeholderTextColor="#666"
            multiline
            maxLength={1000}
          />
          <TouchableOpacity
            style={[styles.button, !msg.trim() && styles.buttonDisabled]}
            onPress={handleButtonClick}
            activeOpacity={0.7}
            disabled={!msg.trim()}
          >
            <Text style={styles.buttonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f5ff",
  },
  header: {
    backgroundColor: "#6A0DAD",
    justifyContent: "flex-end",
    paddingBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    zIndex: 1000,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  headerText: {
    color: "white",
    fontSize: 24,
    textAlign: "left",
    fontFamily: "Rowdies_Bold",
  },
  homeIcon: {
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  headerSubText: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 14,
  },
  messagesContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  message: {
    maxWidth: "85%",
    padding: 14,
    borderRadius: 20,
    marginVertical: 6,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  lastMessage: {
    marginBottom: 8,
    transform: [{ scale: 1 }],
  },
  userMessage: {
    backgroundColor: "#6A0DAD",
    alignSelf: "flex-end",
    borderTopRightRadius: 4,
  },
  geminiMessage: {
    backgroundColor: "white",
    alignSelf: "flex-start",
    borderTopLeftRadius: 4,
  },
  assistantIndicator: {
    position: "absolute",
    top: -20,
    left: 10,
    backgroundColor: "#6A0DAD",
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  assistantIcon: {
    fontSize: 14,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: "Oxygen_Regular",
  },
  userMessageText: {
    color: "white",
  },
  geminiMessageText: {
    color: "#333",
  },
  inputContainer: {
    backgroundColor: "#f8f5ff",
    borderTopWidth: 1,
    borderTopColor: "rgba(106, 13, 173, 0.1)",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#f8f5ff",
  },
  input: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 18,
    marginRight: 8,
    color: "#333",
    fontSize: 16,
    maxHeight: 120,
    borderWidth: 1,
    borderColor: "rgba(106, 13, 173, 0.2)",
    fontFamily: "Tajawal_Regular",
  },
  button: {
    backgroundColor: "#6A0DAD",
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  buttonDisabled: {
    backgroundColor: "rgba(106, 13, 173, 0.5)",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    fontFamily: "Tajawal_Regular",
  },
});

export default ChatComponent;
