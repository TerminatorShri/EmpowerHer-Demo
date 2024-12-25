import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Linking,
  ActivityIndicator,
  ToastAndroid,
  Alert,
} from "react-native";
import { Feather, MaterialIcons, AntDesign } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { updateUserProfile } from "../../contexts/userSlice";
import { AppDispatch, RootState } from "../../store/store";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../config/firebase.config";
import { updateContactNumber } from "../../services/firebase/auth.services";

const InformationTab: React.FC = () => {
  const uid = useSelector((state: RootState) => state.appUser.user?.uid);
  const contactNumber = useSelector(
    (state: RootState) => state.appUser.user?.contactNumber
  );

  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [newContact, setNewContact] = useState<string>(contactNumber || "");
  const [email, setEmail] = useState<string | null>(null);
  const [contactError, setContactError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch<AppDispatch>();

  const handleContactSave = () => {
    if (!uid) {
      Alert.alert("Error", "User ID is missing.");
      return;
    }

    if (!newContact || newContact.length !== 10) {
      setContactError("Please enter a valid contact number");
      return;
    }

    setIsLoading(true);

    updateContactNumber(uid as string, newContact)
      .then(() => {
        dispatch(updateUserProfile({ contactNumber: newContact }));
        ToastAndroid.showWithGravity(
          "Contact number updated successfully",
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM
        );
      })
      .catch((error: any) => {
        Alert.alert("Error", "Failed to update contact number.");
      })
      .finally(() => {
        setIsLoading(false);
        setIsContactOpen(false);
        setContactError(null);
      });
  };

  const handleDeleteContact = () => {
    Alert.alert(
      "Delete Contact",
      "Are you sure you want to delete your contact number?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => {
            setIsLoading(true);
            updateContactNumber(uid as string, "")
              .then(() => {
                ToastAndroid.showWithGravity(
                  "Contact number deleted successfully",
                  ToastAndroid.LONG,
                  ToastAndroid.BOTTOM
                );
              })
              .catch((error: any) => {
                Alert.alert("Error", "Failed to delete contact number.");
              })
              .finally(() => {
                setIsLoading(false);
                setIsContactOpen(false);
                setNewContact("");
                dispatch(updateUserProfile({ contactNumber: "" }));
                console.log("Here");
              });
          },
        },
      ],
      { cancelable: false }
    );
  };

  const handleForgotPassword = () => {
    if (email && !email.includes("@")) {
      setEmailError("Please enter a valid email");
      return;
    } else if (!email) {
      setEmailError("Please enter an email address");
      return;
    } else {
      setIsLoading(true);
      sendPasswordResetEmail(auth, email as string)
        .then(() => {
          setIsLoading(false);
          ToastAndroid.showWithGravity(
            "Password reset mail sent successfully",
            ToastAndroid.BOTTOM,
            ToastAndroid.LONG
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
            Alert.alert(
              "Error",
              "Something went wrong. Please try again later."
            );
          }
        })
        .finally(() => {
          setIsLoading(false);
          setIsPasswordOpen(false);
          setEmail(null);
        });
    }
  };

  return (
    <View style={styles.menuContainer}>
      {/* Edit Contact Number Section */}
      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => setIsContactOpen(!isContactOpen)}
      >
        <View style={styles.menuItemName}>
          <AntDesign name="contacts" size={24} color="black" />
          <Text style={styles.menuItemText}>Edit Contact Number</Text>
          <Feather
            name={isContactOpen ? "chevron-down" : "chevron-right"}
            size={24}
            color="#333"
            style={styles.chevron}
          />
        </View>
        {isContactOpen && (
          <View style={[styles.contactNumberContainer]}>
            <TextInput
              style={[styles.fullWidthInput]}
              value={newContact || ""}
              onChangeText={setNewContact}
              placeholder="Enter new contact number"
              keyboardType="phone-pad"
            />
            {contactError && (
              <Text style={styles.errorText}>{contactError}</Text>
            )}
            <View style={styles.actionButtons}>
              <TouchableOpacity
                onPress={handleDeleteContact}
                disabled={!newContact}
              >
                <Feather
                  name="trash-2"
                  size={20}
                  color={!newContact ? "#ccc" : "red"}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleContactSave}
                style={styles.saveButton}
              >
                {isLoading ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <Text style={styles.saveButtonText}>Save</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}
      </TouchableOpacity>

      {/* Change Password Section */}
      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => setIsPasswordOpen(!isPasswordOpen)}
      >
        <View style={styles.menuItemName}>
          <MaterialIcons name="password" size={24} color="black" />
          <Text style={styles.menuItemText}>Change Password</Text>
          <Feather
            name={isPasswordOpen ? "chevron-down" : "chevron-right"}
            size={24}
            color="#333"
            style={styles.chevron}
          />
        </View>
        {isPasswordOpen && (
          <View style={[styles.contactNumberContainer]}>
            <Text style={styles.mailInstructionText}>
              Please enter your email address below, and you will receive an
              email with instructions to reset your password.
            </Text>
            <TextInput
              value={email || ""}
              style={[styles.fullWidthInput]}
              onChangeText={setEmail}
              placeholder="Enter your email"
              keyboardType="email-address"
            />
            {emailError && <Text style={styles.errorText}>{emailError}</Text>}
            <View style={styles.actionButtonsPassword}>
              <TouchableOpacity
                onPress={handleForgotPassword}
                style={styles.saveButton}
              >
                {isLoading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.saveButtonText}>Send</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}
      </TouchableOpacity>

      {/* Help Section */}
      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => setIsHelpOpen(!isHelpOpen)}
      >
        <View style={styles.menuItemName}>
          <Feather name="help-circle" size={24} color="black" />
          <Text style={styles.menuItemText}>Help</Text>
          <Feather
            name={isHelpOpen ? "chevron-down" : "chevron-right"}
            size={24}
            color="#333"
            style={styles.chevron}
          />
        </View>
        {isHelpOpen && (
          <View style={[styles.helpContainer]}>
            <Text style={styles.helpText}>
              For any help contact{" "}
              <Text>
                <TouchableOpacity
                  onPress={() =>
                    Linking.openURL("mailto:shriyashdongarkar@gmail.com")
                  }
                >
                  <Text style={styles.emailText}>
                    shriyashdongarkar@gmail.com
                  </Text>
                </TouchableOpacity>
              </Text>
            </Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Permissions Section */}
      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => {
          Linking.openSettings();
        }}
      >
        <View style={styles.menuItemName}>
          <MaterialIcons name="manage-accounts" size={24} color="black" />
          <Text style={styles.menuItemText}>Manage Permissions</Text>
          <Feather
            name={"chevron-right"}
            size={24}
            color="#333"
            style={styles.chevron}
          />
        </View>
      </TouchableOpacity>

      {/* Log Out Section */}
      <TouchableOpacity style={styles.menuItem}>
        <View style={styles.menuItemName}>
          <AntDesign name="logout" size={24} color="black" />
          <Text style={styles.menuItemText}>Log Out</Text>
          <Feather
            name="chevron-right"
            size={24}
            color="#333"
            style={styles.chevron}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  menuContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  menuItem: {
    flexDirection: "column",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  menuItemName: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  menuItemText: {
    fontSize: 14,
    marginLeft: 15,
    flex: 1,
    fontFamily: "Oxygen_Regular",
  },
  chevron: {
    marginLeft: 10,
  },
  contactNumberContainer: {
    width: "100%",
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    marginTop: 10,
  },
  fullWidthInput: {
    width: "100%",
    fontSize: 14,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    borderColor: "#6200ee",
    borderWidth: 1,
    marginBottom: 10,
    color: "#333",
    fontFamily: "Oxygen_Regular",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  actionButtonsPassword: {
    width: "100%",
    backgroundColor: "#fff",
  },
  saveButton: {
    backgroundColor: "#9067c6",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
  },
  saveButtonText: {
    fontSize: 14,
    color: "#fff",
    fontFamily: "Oxygen_Regular",
  },
  helpContainer: {
    width: "100%",
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  helpText: {
    fontSize: 14,
    color: "#333",
    fontFamily: "Oxygen_Regular",
  },
  errorText: {
    fontSize: 12,
    color: "red",
    marginTop: 5,
  },
  emailText: {
    color: "#007bff", // or any other color to highlight the link
    textDecorationLine: "underline", // Makes it look like a link
    fontFamily: "Oxygen_Regular",
  },
  mailInstructionText: {
    fontSize: 14,
    color: "#333",
    marginBottom: 10,
    textAlign: "center",
    fontFamily: "Oxygen_Regular",
  },
});

export default InformationTab;
