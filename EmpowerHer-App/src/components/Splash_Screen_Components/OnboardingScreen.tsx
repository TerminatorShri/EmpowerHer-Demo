import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  BackHandler,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store/store";
import { setCurrentScreen } from "../../contexts/screenSlice";
import { useFonts } from "expo-font";

const { width, height } = Dimensions.get("window");

interface OnboardingItem {
  title: string;
  description: string;
  image: string;
  backgroundColor: string;
}

const onboardingData: OnboardingItem[] = [
  {
    title: "Experience Improved Safety and Stronger Community Support",
    description:
      "With Rakshita, safeguarded by the Nirbhaya Squad, receive prompt assistance during emergencies. Enjoy enhanced safety features like incident reporting and a personalized safety timer to ensure your protection at all times.",
    image:
      "https://res.cloudinary.com/desa0upux/image/upload/v1731435533/rn0gazdlrprzsoss5lbs.png",
    backgroundColor: "#f0eff4",
  },
  {
    title: "Receive Support from a Vibrant and Engaged Community",
    description:
      "With the Community feature, you'll receive timely updates on schemes, incentives for women, and various opportunities focused on overall well-being.",
    image:
      "https://res.cloudinary.com/desa0upux/image/upload/v1731435495/crtzipl9ty1rnifakne0.png",
    backgroundColor: "#f0eff4",
  },
  {
    title: "A Personalized Mental Health Chatbot",
    description:
      " Designed to Provide Tailored Support and Guidance.Receive responses to all your queries, tailored to your emotions and needs.",
    image:
      "https://res.cloudinary.com/desa0upux/image/upload/v1731435476/pvsblpa25oduk95ux4mo.png",
    backgroundColor: "#f0eff4",
  },
];

const OnboardingScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [currentIndex, setCurrentIndex] = useState(0);

  const [fontsLoaded] = useFonts({
    Kanit_Medium: require("../../../assets/Fonts/Kanit-Medium.ttf"),
    Tajawal_Regular: require("../../../assets/Fonts/Tajawal-Regular.ttf"),
    Oxygen_Regular: require("../../../assets/Fonts/Oxygen-Regular.ttf"),
  });

  useEffect(() => {
    const backAction = () => {
      if (currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [currentIndex]);

  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      dispatch(setCurrentScreen("welcome"));
    }
  };

  const handleSkip = () => {
    dispatch(setCurrentScreen("welcome"));
  };

  const currentItem = onboardingData[currentIndex];

  if (!fontsLoaded) {
    return <ActivityIndicator size="large" color="#9067c6" />;
  }

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: currentItem.backgroundColor },
      ]}
    >
      <StatusBar
        backgroundColor={currentItem.backgroundColor}
        barStyle="dark-content"
      />
      <View style={styles.imageContainer}>
        <Image source={{ uri: currentItem.image }} style={styles.image} />
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{currentItem.title}</Text>
        <Text style={styles.description}>{currentItem.description}</Text>
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>
            {currentIndex === onboardingData.length - 1
              ? "Get Started"
              : "Next"}
          </Text>
        </TouchableOpacity>
        {currentIndex < onboardingData.length - 1 && (
          <TouchableOpacity onPress={handleSkip}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        )}
        <View style={styles.paginationContainer}>
          {onboardingData.map((_, index) => (
            <View
              key={index}
              style={[
                styles.paginationDot,
                index === currentIndex && styles.paginationDotActive,
              ]}
            />
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
  },
  imageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  image: {
    width: width * 0.8,
    height: width * 0.8,
    resizeMode: "contain",
  },
  contentContainer: {
    width: "100%",
    backgroundColor: "white",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 30,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 10,
    color: "#333",
    fontFamily: "Kanit_Medium",
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 30,
    color: "#666",
    fontFamily: "Tajawal_Regular",
  },
  nextButton: {
    backgroundColor: "#8A2BE2",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    width: "100%",
    alignItems: "center",
  },
  nextButtonText: {
    color: "white",
    fontSize: 18,
    fontFamily: "Oxygen_Regular",
  },
  skipText: {
    marginTop: 20,
    color: "#666",
    fontSize: 16,
    fontFamily: "Oxygen_Regular",
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ccc",
    marginHorizontal: 5,
  },
  paginationDotActive: {
    backgroundColor: "#8A2BE2",
    width: 20,
  },
});

export default OnboardingScreen;
