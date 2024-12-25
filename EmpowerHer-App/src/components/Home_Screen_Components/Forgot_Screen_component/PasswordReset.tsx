import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Keyboard,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  BackHandler,
} from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../store/store";
import { setCurrentScreen } from "../../../contexts/screenSlice";
import { auth } from "../../../config/firebase.config";
import { sendPasswordResetEmail } from "firebase/auth";
import { useFonts } from "expo-font";

const ForgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
});

const MailForPassWord = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  const [fontsLoaded] = useFonts({
    Faculty_Glyphic: require("../../../../assets/Fonts/FacultyGlyphic-Regular.ttf"),
    Oxygen_Regular: require("../../../../assets/Fonts/Oxygen-Regular.ttf"),
  });

  useEffect(() => {
    const backAction = () => {
      dispatch(setCurrentScreen("login"));
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [dispatch]);

  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardVisible(true);
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardVisible(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const handleForgotPassword = (values: { email: string }) => {
    setLoading(true);
    sendPasswordResetEmail(auth, values.email)
      .then(() => {
        setLoading(false);
        Alert.alert(
          "Success",
          "An email has been sent to reset your password. Please reset your password and then log in to your account.",
          [
            {
              text: "OK",
              onPress: () => dispatch(setCurrentScreen("login")),
            },
          ]
        );
      })
      .catch((error: any) => {
        if (error.code === "auth/invalid-email") {
          Alert.alert("Invalid Email", "Please enter a valid email address.");
        } else if (error.code === "auth/user-not-found") {
          Alert.alert(
            "User Not Found",
            "No user found with this email address."
          );
        } else {
          Alert.alert("Error", "Something went wrong. Please try again later.");
        }
      });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View
        style={[styles.mailContainer, keyboardVisible && { paddingTop: 310 }]}
      >
        <Text style={styles.forgotPassText}>Forgot Password ?</Text>

        <Text style={styles.infoText}>
          Don't worry! It happens. Please enter the email address linked with
          your account.
        </Text>

        <Formik
          initialValues={{ email: "" }}
          validationSchema={ForgotPasswordSchema}
          onSubmit={(values) => handleForgotPassword(values)}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
          }) => (
            <>
              <TextInput
                placeholder="Enter your email"
                style={styles.enterEmailInput}
                onChangeText={handleChange("email")}
                onBlur={handleBlur("email")}
                value={values.email}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              {touched.email && errors.email ? (
                <Text style={styles.errorText}>{errors.email}</Text>
              ) : null}

              <TouchableOpacity
                style={styles.sendCodebutton}
                onPress={handleSubmit as any}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.sendCodeButtonText}>Send Mail</Text>
                )}
              </TouchableOpacity>
            </>
          )}
        </Formik>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  mailContainer: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  forgotPassText: {
    fontSize: 24,
    marginBottom: 7,
    fontFamily: "Faculty_Glyphic",
  },
  enterEmailInput: {
    borderColor: "#AE81D9",
    borderWidth: 1,
    borderRadius: 7,
    marginBottom: 9,
    padding: 10,
    fontFamily: "Oxygen_Regular",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 10,
    textAlign: "left",
    fontFamily: "Oxygen_Regular",
  },
  sendCodebutton: {
    marginTop: 15,
    backgroundColor: "#9067c6",
    padding: 14,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 350,
  },
  sendCodeButtonText: {
    color: "#FFFFFF",
    fontFamily: "Oxygen_Regular",
    fontSize: 16,
  },
  infoText: {
    marginTop: 2,
    fontSize: 14,
    color: "#6C757D",
    marginBottom: 20,
    fontFamily: "Oxygen_Regular",
  },
});

export default MailForPassWord;
