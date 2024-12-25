import React from "react";
import { StyleSheet, Text, View } from "react-native";
import MailForPassword from "../components/Home_Screen_Components/Forgot_Screen_component/PasswordReset";
import OTPForPassword from "../components/Home_Screen_Components/Forgot_Screen_component/OTPForPassword";
import PasswordChanged from "../components/Home_Screen_Components/Forgot_Screen_component/PasswordChanged";
import ResetPasswordScreen from "../components/Home_Screen_Components/Forgot_Screen_component/ResetPasswordScreen";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

const ForgotPasswordScreen: React.FC = () => {
  const currentStage = useSelector(
    (state: RootState) => state.changePassword.screenStage
  );

  const renderScreen = () => {
    switch (currentStage) {
      case "mail":
        return <MailForPassword />;
      case "otp":
        return <OTPForPassword />;
      case "changed":
        return <ResetPasswordScreen />;
      case "successful":
        return <PasswordChanged />;
      default:
        return null;
    }
  };

  return <View style={styles.changePasswordContainer}>{renderScreen()}</View>;
};

const styles = StyleSheet.create({
  changePasswordContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
});

export default ForgotPasswordScreen;
