import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Formik } from "formik";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import {
  setOTPStatus,
  setPasswordScreenStage,
} from "../../../contexts/changePasswordSlice";
import { AppDispatch } from "../../../store/store";

const OTPSchema = Yup.object().shape({
  otp: Yup.string()
    .length(4, "OTP must be exactly 4 digits")
    .required("OTP is required"),
});

const OTPVerification: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [otpValues, setOtpValues] = useState<string[]>(["", "", "", ""]);

  const handleOTPSubmission = (values: { otp: string }) => {
    const isOTPCorrect = values.otp === otpValues.join("");
    dispatch(setOTPStatus(isOTPCorrect));
    dispatch(setPasswordScreenStage("changed"));
  };

  const handleOtpChange = (
    value: string,
    index: number,
    setFieldValue: (field: string, value: any) => void
  ) => {
    const updatedOtp = [...otpValues];
    updatedOtp[index] = value;
    setOtpValues(updatedOtp);
    setFieldValue("otp", updatedOtp.join(""));
  };

  return (
    <View style={styles.OTPcontainer}>
      <Text style={styles.OTPVerificationTitle}>OTP verification</Text>
      <Text style={styles.infoContainer}>
        Enter the verification code we just sent to your email.
      </Text>

      <Formik
        initialValues={{ otp: "" }}
        validationSchema={OTPSchema}
        onSubmit={handleOTPSubmission}
      >
        {({ handleSubmit, errors, touched, setFieldValue }) => (
          <View>
            <View style={styles.OTPCode}>
              {otpValues.map((otp, index) => (
                <TextInput
                  key={index}
                  style={styles.OTPInput}
                  keyboardType="numeric"
                  maxLength={1}
                  value={otp}
                  onChangeText={(value) =>
                    handleOtpChange(value, index, setFieldValue)
                  }
                />
              ))}
            </View>

            {errors.otp && touched.otp && (
              <Text style={styles.errorText}>{errors.otp}</Text>
            )}

            <TouchableOpacity
              style={styles.OTPVerifyButton}
              onPress={() => {
                handleSubmit();
              }}
            >
              <Text style={styles.OTPSubmitText}>Verify</Text>
            </TouchableOpacity>
          </View>
        )}
      </Formik>
    </View>
  );
};

const styles = StyleSheet.create({
  OTPcontainer: {
    flex: 1,
    padding: 20,
  },
  OTPVerificationTitle: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: "bold",
  },
  infoContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  OTPCode: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    marginBottom: 20,
  },
  OTPInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    width: 50,
    height: 50,
    textAlign: "center",
    fontSize: 20,
  },
  errorText: {
    color: "red",
    marginBottom: 20,
  },
  OTPVerifyButton: {
    backgroundColor: "#7A4791",
    padding: 14,
    borderRadius: 5,
    alignItems: "center",
  },
  OTPSubmitText: {
    color: "#fff",
    fontSize: 18,
  },
});

export default OTPVerification;
