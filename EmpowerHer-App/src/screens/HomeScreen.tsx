import React, { useEffect, useState } from "react";
import { View, StyleSheet, Keyboard } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import WelcomeScreen from "../components/Home_Screen_Components/WelcomeScreen";
import LoginScreen from "../components/Home_Screen_Components/LoginScreen";
import RegisterScreen from "../components/Home_Screen_Components/RegisterScreen";
import InfoScreen from "../components/Home_Screen_Components/InfoScreen";
import BottomNavigation from "../components/BottomNavigation";
import ChatbotScreen from "./ChatbotScreen";
import CommunityScreen from "./CommunityScreen";
import SettingsScreen from "./SettingsScreen";
import SecurityScreen from "./SecurityScreen";
import ForgotPasswordScreen from "./ForgotPasswordScreen";
import { RootState } from "../store/store";
import OnboardingScreen from "../components/Splash_Screen_Components/OnboardingScreen";
import { AppDispatch } from "../store/store";
import { setIsLoggedIn, setCurrentScreen } from "../contexts/screenSlice";
import { checkUserSession as checkUserSessionService } from "../services/database/UserSession.services";
import EmergencyScreen from "../components/Home_Screen_Components/EmergencyScreen";

const HomeScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const isLoggedIn = useSelector((state: RootState) => state.screen.isLoggedIn);
  const isEmergency = useSelector(
    (state: RootState) => state.screen.isEmergency
  );
  const isChatbot = useSelector((state: RootState) => state.screen.isChatbot);
  const currentScreen = useSelector(
    (state: RootState) => state.screen.currentScreen
  );

  const [iseKeyboardVisible, setIsKeyboardVisible] = useState<boolean>(false);

  useEffect(() => {
    const fetchUserSession = async () => {
      // const isLoggedIn = await checkUserSessionService();

      if (isLoggedIn) {
        dispatch(setIsLoggedIn(true));
        dispatch(setCurrentScreen("info"));
      }
    };

    fetchUserSession();
  }, []);

  useEffect(() => {
    const keyboardShowListener = Keyboard.addListener("keyboardDidShow", () =>
      setIsKeyboardVisible(true)
    );

    const keyboardHideListener = Keyboard.addListener("keyboardDidHide", () =>
      setIsKeyboardVisible(false)
    );

    return () => {
      keyboardShowListener.remove();
      keyboardHideListener.remove();
    };
  }, []);

  const renderScreen = () => {
    switch (currentScreen) {
      case "onboarding":
        return <OnboardingScreen />;
      case "welcome":
        return <WelcomeScreen />;
      case "login":
        return <LoginScreen />;
      case "register":
        return <RegisterScreen />;
      case "info":
        return <InfoScreen />;
      case "chatbot":
        return <ChatbotScreen />;
      case "community":
        return <CommunityScreen />;
      case "settings":
        return <SettingsScreen />;
      case "security":
        return <SecurityScreen />;
      case "forgotPassword":
        return <ForgotPasswordScreen />;
      case "emergency":
        return <EmergencyScreen />;
      // default:
      //   return <Home />;
    }
  };

  return (
    <View style={styles.mainContainer}>
      {renderScreen()}
      {isLoggedIn && !isEmergency && !iseKeyboardVisible && !isChatbot && (
        <BottomNavigation />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    // backgroundColor: "#f8e6fc",
    // backgroundColor: "#fcf6f2",
    backgroundColor: "#f0eff4",
    paddingBottom: 5,
  },
});

export default HomeScreen;
