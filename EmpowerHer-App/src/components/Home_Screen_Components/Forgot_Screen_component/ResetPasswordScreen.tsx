import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import {
  setNewPassword,
  setPasswordScreenStage,
} from "../../../contexts/changePasswordSlice";
import { AppDispatch } from "../../../store/store";

const PasswordResetSchema = Yup.object().shape({
  password: Yup.string()
    .min(8, "Password must be at least 8 characters long")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm Password is required"),
});

const ResetPasswordScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const handleResetPassword = (values: { password: string }) => {
    dispatch(setNewPassword(values.password));
    dispatch(setPasswordScreenStage("successful"));
  };

  return (
    <View style={styles.resetPassContainer}>
      <Text style={styles.newPassText}>Create New Password</Text>

      <Text style={styles.infoText}>
        Your new password must be unique from those previously used.
      </Text>

      <Formik
        initialValues={{ password: "", confirmPassword: "" }}
        validationSchema={PasswordResetSchema}
        onSubmit={(values, { resetForm }) => {
          handleResetPassword(values);
          resetForm();
        }}
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
              placeholder="New Password"
              style={styles.newPassInput}
              onChangeText={handleChange("password")}
              onBlur={handleBlur("password")}
              value={values.password}
              secureTextEntry
            />
            {touched.password && errors.password && (
              <Text style={styles.errorText}>{errors.password}</Text>
            )}

            <TextInput
              placeholder="Confirm Password"
              style={styles.newPassInput}
              onChangeText={handleChange("confirmPassword")}
              onBlur={handleBlur("confirmPassword")}
              value={values.confirmPassword}
              secureTextEntry
            />
            {touched.confirmPassword && errors.confirmPassword && (
              <Text style={styles.errorText}>{errors.confirmPassword}</Text>
            )}

            <TouchableOpacity
              style={styles.resetPassButton}
              onPress={handleSubmit as any}
            >
              <Text style={styles.resetPassButtonText}>Reset Password</Text>
            </TouchableOpacity>
          </>
        )}
      </Formik>
    </View>
  );
};

const styles = StyleSheet.create({
  resetPassContainer: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  newPassText: {
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
  newPassInput: {
    borderColor: "#AE81D9",
    borderWidth: 1,
    borderRadius: 7,
    marginBottom: 9,
    padding: 10,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 10,
    textAlign: "left",
  },
  resetPassButton: {
    backgroundColor: "#7A4791",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 370,
  },
  resetPassButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default ResetPasswordScreen;
