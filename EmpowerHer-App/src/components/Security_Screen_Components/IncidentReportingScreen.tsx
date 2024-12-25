import {
  StyleSheet,
  Text,
  View,
  Alert,
  BackHandler,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { AppDispatch } from "../../store/store";
import { useDispatch } from "react-redux";
import { setCurrentFeature } from "../../contexts/securityFeatureSlice";
import * as Yup from "yup";
import { IncidentReportingFormValues } from "../../types/types";
import { Formik } from "formik";
import * as ImagePicker from "expo-image-picker";
import { Picker } from "@react-native-picker/picker";
import { saveIncidentReport } from "../../services/firebase/securityScreen.services";
import { setCurrentScreen } from "../../contexts/screenSlice";
import { useFonts } from "expo-font";
import { uploadImageToCloudinary } from "../../utils/imageUpload.utils";

const incidentReportingSchema = Yup.object().shape({
  name: Yup.string(),
  description: Yup.string().required("Description is required"),
  location: Yup.string().required("Location is required"),
  contact: Yup.string()
    .required("Contact number is required")
    .matches(/^[0-9]{10}$/, "Contact number must be 10 digits"),
  reportTo: Yup.string().required("Please select a report option"),
});

const IncidentReportingScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [fontsLoaded] = useFonts({
    Tajawal_Medium: require("../../../assets/Fonts/Tajawal-Medium.ttf"),
    Tajawal_Bold: require("../../../assets/Fonts/Tajawal-Bold.ttf"),
    Oxygen_Regular: require("../../../assets/Fonts/Oxygen-Regular.ttf"),
  });

  useEffect(() => {
    const backAction = () => {
      dispatch(setCurrentFeature("features"));
      dispatch(setCurrentScreen("security"));
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [dispatch]);

  const handleImageUpload = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert("Permission to access camera roll is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSubmit = async (values: IncidentReportingFormValues) => {
    setLoading(true);
    try {
      const imageUrl = image ? await uploadImageToCloudinary(image) : "";
      await saveIncidentReport({ ...values, imageUrl });
      Alert.alert("Report Submitted", "Your incident report has been saved.");
    } catch (error) {
      Alert.alert("Error", "An error occurred while submitting the report.");
    } finally {
      setLoading(false);
    }
  };

  if (!fontsLoaded) {
    return <ActivityIndicator size="large" color="#9067c6" />;
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.heading}>Incident Reporting</Text>
        <View style={styles.incidentReportingMainContainer}>
          <Text style={styles.infoText}>
            Quickly seek help from government authorities or support
            organizations in cases of domestic abuse or other wrongful acts.
            This feature enables you to provide essential details, including
            images, location, and a description of the incident, to ensure
            timely and effective assistance.
          </Text>
          <Image
            source={{
              uri: "https://res.cloudinary.com/desa0upux/image/upload/v1731348281/a7ftxljaq4ubsbbk4a9l.png",
            }}
            style={styles.infoImage}
          />
        </View>
        <View style={styles.incidentReportingMainContainer}>
          <Formik
            initialValues={{
              name: "",
              description: "",
              location: "",
              contact: "",
              reportTo: "support groups",
              status: "pending",
            }}
            validationSchema={incidentReportingSchema}
            onSubmit={handleSubmit}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
              <>
                <TouchableOpacity
                  style={styles.uploadButton}
                  onPress={handleImageUpload}
                >
                  <Text style={styles.uploadButtonText}>
                    {image ? "Change Image" : "Upload Image"}
                  </Text>
                </TouchableOpacity>
                {image && (
                  <Image source={{ uri: image }} style={styles.imagePreview} />
                )}

                <TextInput
                  style={styles.input}
                  placeholder="Name"
                  onChangeText={handleChange("name")}
                  onBlur={handleBlur("name")}
                  value={values.name}
                />
                {errors.name && (
                  <Text style={styles.errorText}>{errors.name}</Text>
                )}

                <TextInput
                  style={styles.inputMultiline}
                  placeholder="Description"
                  onChangeText={handleChange("description")}
                  onBlur={handleBlur("description")}
                  value={values.description}
                  multiline
                  numberOfLines={4}
                />
                {errors.description && (
                  <Text style={styles.errorText}>{errors.description}</Text>
                )}

                <TextInput
                  style={styles.input}
                  placeholder="Location"
                  onChangeText={handleChange("location")}
                  onBlur={handleBlur("location")}
                  value={values.location}
                />
                {errors.location && (
                  <Text style={styles.errorText}>{errors.location}</Text>
                )}

                <TextInput
                  style={styles.input}
                  placeholder="Contact Number"
                  onChangeText={handleChange("contact")}
                  onBlur={handleBlur("contact")}
                  value={values.contact}
                  keyboardType="numeric"
                />
                {errors.contact && (
                  <Text style={styles.errorText}>{errors.contact}</Text>
                )}

                <Text style={styles.label}>Report to</Text>
                <Picker
                  selectedValue={values.reportTo}
                  style={styles.picker}
                  onValueChange={handleChange("reportTo")}
                >
                  <Picker.Item
                    style={{
                      fontFamily: "Oxygen_Regular",
                    }}
                    label="Select an option"
                    value=""
                  />
                  <Picker.Item
                    style={{
                      fontFamily: "Oxygen_Regular",
                    }}
                    label="Nirbhaya Pathak"
                    value="nirbhayaPathak"
                  />
                  <Picker.Item
                    style={{
                      fontFamily: "Oxygen_Regular",
                    }}
                    label="Support Groups"
                    value="supportGroups"
                  />
                  <Picker.Item
                    style={{
                      fontFamily: "Oxygen_Regular",
                    }}
                    label="Everyone"
                    value="everyone"
                  />
                </Picker>
                {errors.reportTo && (
                  <Text style={styles.errorText}>{errors.reportTo}</Text>
                )}

                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={() => handleSubmit()}
                >
                  {loading ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <Text style={styles.submitButtonText}>Submit Report</Text>
                  )}
                </TouchableOpacity>
              </>
            )}
          </Formik>
        </View>
      </ScrollView>
    </View>
  );
};

export default IncidentReportingScreen;

const styles = StyleSheet.create({
  heading: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 20,
    color: "#7A4791",
    fontFamily: "Tajawal_Bold",
  },
  container: {
    flex: 1,
    borderRadius: 10,
  },
  scrollContainer: {
    paddingBottom: 60,
    marginBottom: 20,
  },
  incidentReportingMainContainer: {
    padding: 20,
    backgroundColor: "#f0eff4",
    borderRadius: 10,
    margin: 10,
    borderColor: "#ddd",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
  },
  infoText: {
    fontSize: 14,
    color: "#333",
    fontFamily: "Oxygen_Regular",
  },
  infoImage: {
    width: "100%",
    height: 200,
    resizeMode: "contain",
    borderRadius: 10,
    marginTop: 10,
  },
  uploadButton: {
    backgroundColor: "#9067c6",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  uploadButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Oxygen_Regular",
  },
  imagePreview: {
    width: 120,
    height: 120,
    marginBottom: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  input: {
    height: 50,
    borderColor: "#7A4791",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
    color: "#7A4791",
    fontFamily: "Oxygen_Regular",
  },
  inputMultiline: {
    height: 100,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 15,
    paddingTop: 10,
    backgroundColor: "#fff",
    color: "#7A4791",
    borderColor: "#7A4791",
  },
  errorText: {
    fontSize: 12,
    color: "red",
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: "#9067c6",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Oxygen_Regular",
  },
  label: {
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
    fontFamily: "Oxygen_Regular",
  },
  picker: {
    height: 50,
    backgroundColor: "#fff",
    borderColor: "#7A4791",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    color: "#7A4791",
  },
});
