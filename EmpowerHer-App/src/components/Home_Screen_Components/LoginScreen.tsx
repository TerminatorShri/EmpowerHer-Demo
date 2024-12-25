import {
  View,
  Text,
  Image,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ToastAndroid,
} from "react-native";
import React, { useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { setIsLoggedIn, setCurrentScreen } from "../../contexts/screenSlice";
import { AppDispatch } from "../../store/store";
import { CurrentUser, UserSession } from "../../types/types";
import {
  loginUser,
  getCurrentUserInfomation,
} from "../../services/firebase/auth.services";
import { setUser, setSession } from "../../contexts/userSlice";
import {
  updateSafetyTimerTimeInterval,
  setSOSButtonContacts,
  setSafetyTimerContacts,
} from "../../contexts/securityFeatureSlice";
import { useFonts } from "expo-font";

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string()
    .min(6, "Password too short")
    .max(16, "Password too long")
    .required("Required"),
});

const LoginScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(false);

  const [fontsLoaded] = useFonts({
    Faculty_Glyphic: require("../../../assets/Fonts/FacultyGlyphic-Regular.ttf"),
    Oxygen_Regular: require("../../../assets/Fonts/Oxygen-Regular.ttf"),
  });

  const handleLogin = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { user, accessToken } = await loginUser(email, password);

      const userInformation = await getCurrentUserInfomation(user.uid);

      ToastAndroid.showWithGravity(
        "Login Successful",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM
      );

      const CurrentUserInfo: CurrentUser = {
        uid: user.uid,
        email: userInformation.email,
        name: userInformation.username,
        profilePhoto: userInformation.profilePhotoUrl,
        contactNumber: userInformation.contactNumber,
      };

      console.log(userInformation);

      const CurrentUserSession: UserSession = {
        token: accessToken,
        isLoggedIn: true,
      };

      console.log(userInformation.SOSButtonContacts);

      dispatch(setUser(CurrentUserInfo));
      dispatch(setSession(CurrentUserSession));
      dispatch(
        updateSafetyTimerTimeInterval(
          userInformation.SafetyTimerInterval || [0, 15]
        )
      );
      dispatch(
        setSOSButtonContacts(userInformation.SOSButtonContacts) || ["", "", ""]
      );
      dispatch(
        setSafetyTimerContacts(userInformation.SafetyTimerContacts) || [
          "",
          "",
          "",
        ]
      );
      dispatch(setIsLoggedIn(true));
      dispatch(setCurrentScreen("info"));
    } catch (error: any) {
      Alert.alert("Login Failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!fontsLoaded) {
    return <ActivityIndicator size="large" color="#9067c6" />;
  }

  return (
    <View style={styles.loginContainer}>
      <Text style={styles.loginMessage}>
        Welcome back! Glad to see you, Again!
      </Text>
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={LoginSchema}
        onSubmit={({ email, password }) => handleLogin(email, password)}
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
              placeholder="Enter Your Email"
              style={styles.loginMailInput}
              onChangeText={handleChange("email")}
              onBlur={handleBlur("email")}
              value={values.email}
            />
            {touched.email && errors.email ? (
              <Text style={styles.inputError}>{errors.email}</Text>
            ) : null}
            <TextInput
              placeholder="Enter Your Password"
              style={styles.loginPasswordInput}
              onChangeText={handleChange("password")}
              onBlur={handleBlur("password")}
              value={values.password}
              secureTextEntry
            />
            {touched.password && errors.password ? (
              <Text style={styles.inputError}>{errors.password}</Text>
            ) : null}
            <TouchableOpacity
              onPress={() => dispatch(setCurrentScreen("forgotPassword"))}
            >
              <Text style={styles.forgotPassword}>Forgot Password ?</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSubmit as any}
              style={styles.loginButton}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.loginText}>Login</Text>
              )}
            </TouchableOpacity>

            <View style={styles.lineContainer}>
              <View style={styles.line} />
              <Text style={styles.loginOptionsText}>Or Login with</Text>
              <View style={styles.line} />
            </View>

            <View style={styles.loginOptionsContainer}>
              <TouchableOpacity>
                <Image
                  source={{
                    uri: "https://res.cloudinary.com/desa0upux/image/upload/v1726831946/fk6wxvosan61dh7slbcd.png",
                  }}
                  style={styles.loginOptionImage}
                />
              </TouchableOpacity>
              <TouchableOpacity>
                <Image
                  source={{
                    uri: "https://res.cloudinary.com/desa0upux/image/upload/v1726910675/pwu1b4kdgpcbqrxvwq4y.jpg",
                  }}
                  style={styles.loginOptionImage}
                />
              </TouchableOpacity>
              <TouchableOpacity>
                <Image
                  source={{
                    uri: "https://res.cloudinary.com/desa0upux/image/upload/v1726911153/cy5ac0gtxagrbr8zxkxq.jpg",
                  }}
                  style={styles.loginOptionImage}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.noAccountContainer}>
              <Text style={styles.noAccountText}>Don't Have an Account ? </Text>
              <TouchableOpacity
                onPress={() => dispatch(setCurrentScreen("register"))}
              >
                <Text style={styles.registerNowText}>Register Now</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </Formik>
    </View>
  );
};

const styles = StyleSheet.create({
  loginContainer: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  loginMessage: {
    fontSize: 35,
    marginBottom: 40,
    fontFamily: "Faculty_Glyphic",
  },
  loginMailInput: {
    borderColor: "#9067c6",
    borderWidth: 1,
    borderRadius: 7,
    marginBottom: 9,
    padding: 10,
    fontFamily: "Oxygen_Regular",
  },
  registerNowText: {
    color: "#9067c6",
    fontFamily: "Oxygen_Regular",
  },
  loginPasswordInput: {
    borderColor: "#9067c6",
    borderWidth: 1,
    borderRadius: 7,
    marginBottom: 9,
    padding: 10,
    fontFamily: "Oxygen_Regular",
  },
  loginOptionsText: {
    marginHorizontal: 10,
    textAlign: "center",
    fontFamily: "Oxygen_Regular",
  },
  loginOptionImage: {
    height: 55,
    width: 55,
    resizeMode: "contain",
    marginHorizontal: 10,
  },
  loginOptionsContainer: {
    margin: 5,
    padding: 5,
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  loginButton: {
    backgroundColor: "#9067c6",
    borderRadius: 5,
    padding: 14,
    color: "#FFFFFF",
  },
  loginText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontFamily: "Oxygen_Regular",
  },
  forgotPassword: {
    textAlign: "right",
    marginBottom: 10,
    fontFamily: "Oxygen_Regular",
  },
  noAccountContainer: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "center",
  },
  lineContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#ccc",
    opacity: 0.5,
  },
  inputError: {
    color: "red",
    fontSize: 12,
    marginBottom: 10,
    marginLeft: 10,
    fontFamily: "Tajawal_Medium",
  },
  noAccountText: {
    fontFamily: "Oxygen_Regular",
  },
});

export default LoginScreen;
