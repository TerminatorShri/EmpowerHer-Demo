import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setCurrentScreen } from "../../../contexts/screenSlice";
import { AppDispatch } from "../../../store/store";

const PasswordChanged = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(setCurrentScreen("login"));
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.passchangedContainer}>
      <Text style={styles.passChangedText}>Password Changed!</Text>

      <Text style={styles.infoText}>
        Your password has been changed successfully.
      </Text>

      <TouchableOpacity
        style={styles.backToLoginButton}
        onPress={() => dispatch(setCurrentScreen("login"))}
      >
        <Text style={styles.backToLoginButtonText}>Back to Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  passchangedContainer: {
    flex: 1,
    justifyContent: "center",
  },
  passChangedText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  infoText: {
    marginTop: 2,
    fontSize: 14,
    color: "#6C757D",
    marginBottom: 25,
  },
  backToLoginButton: {
    backgroundColor: "#7A4791",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  backToLoginButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
    paddingHorizontal: 25,
  },
});

export default PasswordChanged;
