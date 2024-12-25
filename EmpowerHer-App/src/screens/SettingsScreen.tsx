import React, { useEffect } from "react";
import { View, BackHandler, StyleSheet } from "react-native";
import { AppDispatch } from "../store/store";
import { useDispatch } from "react-redux";
import { setCurrentScreen } from "../contexts/screenSlice";
import ProfileScreen from "../components/Settings_Screen_Components/ProfileScreen";

const SettingsScreen: React.FC = () => {
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

  return (
    <View style={styles.container}>
      {/* <Text style={styles.header}>Settings</Text> */}
      <ProfileScreen />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    padding: 16,
  },
});

export default SettingsScreen;
