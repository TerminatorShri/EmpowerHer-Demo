import { View, Text, StyleSheet, BackHandler } from "react-native";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import FeaturesScreen from "../components/Security_Screen_Components/FeaturesScreen";
import SOSButtonScreen from "../components/Security_Screen_Components/SOSButtonScreen";
import SecurityTimerScreen from "../components/Security_Screen_Components/SecurityTimerScreen";
import IncidentReportingScreen from "../components/Security_Screen_Components/IncidentReportingScreen";
import { RootState } from "../store/store";
import { AppDispatch } from "../store/store";
import { useDispatch } from "react-redux";
import { setCurrentScreen } from "../contexts/screenSlice";

const SecurityScreen: React.FC = () => {
  const currentScreen = useSelector(
    (state: RootState) => state.securityFeature.currentFeature
  );

  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    const backAction = () => {
      dispatch(setCurrentScreen("info"));
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [dispatch]);

  const renderScreen = () => {
    switch (currentScreen) {
      case "sosBtn":
        return <SOSButtonScreen />;
      case "incidentReporting":
        return <IncidentReportingScreen />;
      case "safetyTimer":
        return <SecurityTimerScreen />;
      case "features":
        return <FeaturesScreen />;
    }
  };

  return <View style={styles.securityContainer}>{renderScreen()}</View>;
};

export default SecurityScreen;

const styles = StyleSheet.create({
  securityContainer: {
    flex: 1,
    padding: 20,
    justifyContent: "space-between",
    flexDirection: "column",
    alignItems: "center",
    height: "100%",
  },
});
