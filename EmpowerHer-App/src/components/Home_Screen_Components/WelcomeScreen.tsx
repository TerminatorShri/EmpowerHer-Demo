import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { useDispatch } from "react-redux";
import { setCurrentScreen } from "../../contexts/screenSlice";
import { AppDispatch } from "../../store/store";
import { useFonts } from "expo-font";

const WelcomeScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const [fontsLoaded] = useFonts({
    Faculty_Glyphic: require("../../../assets/Fonts/FacultyGlyphic-Regular.ttf"),
    Kanit_Light: require("../../../assets/Fonts/Kanit-Light.ttf"),
  });

  const handlePress = (screen: "login" | "register") => {
    dispatch(setCurrentScreen(screen));
  };

  if (!fontsLoaded) {
    return <ActivityIndicator size="large" color="#9067c6" />;
  }

  return (
    <SafeAreaView style={styles.welcomeMainContainer}>
      <Image
        source={{
          uri: "https://res.cloudinary.com/desa0upux/image/upload/v1726050669/ygsi5zmj3ufblvymizym.png",
        }}
        style={styles.image}
      />
      <Text style={styles.title}>Safeguarded by Rakshita</Text>
      <View style={styles.welcomeScreenButtonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.loginButton]}
          onPress={() => handlePress("login")}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.registerButton]}
          onPress={() => handlePress("register")}
        >
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  welcomeMainContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  image: {
    width: "100%",
    height: 150,
    marginBottom: 4,
  },
  title: {
    fontSize: 20,
    marginBottom: 30,
    color: "#6b5b95",
    fontFamily: "Faculty_Glyphic",
  },
  welcomeScreenButtonContainer: {
    flexDirection: "row",
    marginTop: 20,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginHorizontal: 10,
  },
  loginButton: {
    backgroundColor: "#6b5b95",
  },
  registerButton: {
    backgroundColor: "#945c83",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Kanit_Light",
  },
});

export default WelcomeScreen;
