import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  BackHandler,
  Image,
  TextInput,
  ScrollView,
  Modal,
  ToastAndroid,
  ActivityIndicator,
  Vibration,
} from "react-native";
import React, { useEffect, useState } from "react";
import * as Location from "expo-location";
import AntDesign from "@expo/vector-icons/AntDesign";
import { AppDispatch, RootState } from "../../store/store";
import { useDispatch, useSelector } from "react-redux";
import {
  setCurrentFeature,
  updateSafetyTimerTimeInterval,
} from "../../contexts/securityFeatureSlice";
import { setCurrentScreen } from "../../contexts/screenSlice";
import { Picker } from "@react-native-picker/picker";
import { updateUserData } from "../../services/firebase/securityScreen.services";
import { sendSmsWithLocation } from "../../utils/notifications.utils";
import { TEST_NUMBER } from "@env";
import { useFonts } from "expo-font";

const SecurityTimerScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const safetyTimerInterval = useSelector(
    (state: RootState) => state.securityFeature.safetyTimerTimeInterval
  );
  const SafetyTimerContacts = useSelector(
    (state: RootState) => state.securityFeature.safetyTimerContacts
  );
  const uid = useSelector((state: RootState) => state.appUser.user?.uid);
  const username = useSelector((state: RootState) => state.appUser.user?.name);

  const [loading, setLoading] = useState(false);
  const [isChanged, setIsChanged] = useState(false);
  const [hours, setHours] = useState<number>(safetyTimerInterval[0]);
  const [minutes, setMinutes] = useState<number>(safetyTimerInterval[1]);
  const [popupVisible, setPopupVisible] = useState<boolean>(false);
  const [contacts, setContacts] = useState<string[]>(() => {
    const updatedContacts = [...SafetyTimerContacts];
    while (updatedContacts.length < 3) updatedContacts.push("");
    return updatedContacts;
  });
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

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

  const validateTime = (): boolean => {
    if (hours === 0 && minutes < 15) {
      Alert.alert("Invalid Input", "Minimum time is 15 minutes.");
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (validateTime()) {
      setLoading(true);
      const contactPresent = contacts.some((contact) => contact.length > 0);
      if (!contactPresent) {
        Alert.alert("Warning", "You need to add at least one contact");
        setLoading(false);
        return;
      }
      try {
        dispatch(updateSafetyTimerTimeInterval([hours, minutes]));
        updateUserData(uid || "User", {
          SafetyTimerInterval: [hours, minutes],
          SafetyTimerContacts: contacts,
        })
          .then(() => {
            setIsChanged(false);
            ToastAndroid.show(
              `Timer set for ${hours} hours and ${minutes} minutes`,
              ToastAndroid.SHORT
            );
            setLoading(false);

            // const timerDuration = (hours * 60 + minutes) * 60 * 1000;
            const timerDuration = 10000;
            setTimeout(() => {
              setPopupVisible(true);
              Vibration.vibrate(5000);
              startPopupTimeout();
            }, timerDuration);
          })
          .catch((error) => {
            Alert.alert("Connection Error", "Sorry For The Inconvenience.");
          });
      } catch (error) {
        console.error("Error saving data:", error);
        Alert.alert("Error", "Failed to save data.");
      }
    }
  };

  const handleContactChange = (index: number, text: string) => {
    const updatedContacts = [...contacts];
    updatedContacts[index] = text;
    setContacts(updatedContacts);

    setIsChanged(
      updatedContacts.some((contact, i) => contact !== SafetyTimerContacts[i])
    );
  };

  const startPopupTimeout = () => {
    const id = setTimeout(
      () => {
        handleNotSafeAction();
      },
      2 * 60 * 1000
    );
    setTimeoutId(id);
  };

  const clearPopupTimeout = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
  };

  const handleSafeAction = () => {
    setPopupVisible(false);
    clearPopupTimeout();
    Alert.alert("Thank you", "Glad to know you're safe!");
  };

  const handleNotSafeAction = () => {
    setPopupVisible(false);
    clearPopupTimeout();

    ToastAndroid.showWithGravity(
      "Safety was not ensured in time. Sending location to selected contacts",
      ToastAndroid.BOTTOM,
      ToastAndroid.LONG
    );

    Location.requestForegroundPermissionsAsync()
      .then(({ status }) => {
        if (status !== "granted") {
          Alert.alert(
            "Location Permission Denied",
            "Please enable location services to use the SOS feature."
          );
          return Promise.reject("Location permission denied");
        }

        return Location.getCurrentPositionAsync({});
      })
      .then((location) => {
        const locationLink = `https://maps.google.com/?q=${location.coords.latitude},${location.coords.longitude}`;

        // Actual API Call (loop through contacts if necessary)
        // SOSButtonContacts.forEach((contact) => {
        //   sendSmsWithLocation(contact, username || "User", locationLink)
        //     .then(() => {
        //       console.log(`SMS sent to ${contact}`);
        //     })
        //     .catch((error) => {
        //       console.error(`Error sending SMS to ${contact}:`, error);
        //     });
        // });

        sendSmsWithLocation(
          TEST_NUMBER,
          username || "User",
          locationLink,
          "sos"
        ).then(() => {
          console.log("SMS sent");
        });
      })
      .catch((error) => {
        console.error("Error during SOS action:", error);
        Alert.alert("Location Error", "Failed to get current location.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  if (!fontsLoaded) {
    return <ActivityIndicator size="large" color="#9067c6" />;
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Text style={styles.heading}>Safety Timer</Text>

      <View style={styles.safetyTimerMainContainer}>
        <Text style={styles.infoText}>
          This feature allows you to set a custom time interval, after which
          you'll receive a prompt to confirm your safety. If you don’t respond
          within the given time, your current location will automatically be
          shared with your selected emergency contacts.
        </Text>
        <Image
          source={{
            uri: "https://res.cloudinary.com/desa0upux/image/upload/v1731257790/qfovp4xpwbyugzbgh5tr.png",
          }}
          style={styles.infoImage}
        />
      </View>

      <View style={styles.pickerContainerMain}>
        <Text style={styles.timerTitle}>Set Timer</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={hours}
            style={styles.picker}
            onValueChange={(itemValue: number) => setHours(itemValue)}
          >
            {[0, 1, 2, 3, 4, 5, 6].map((index) => (
              <Picker.Item key={index} label={`${index}`} value={index} />
            ))}
          </Picker>
          <Text style={styles.colon}>:</Text>
          <Picker
            selectedValue={minutes}
            style={styles.picker}
            onValueChange={(itemValue: number) => setMinutes(itemValue)}
          >
            {[0, 15, 30, 45].map((value) => (
              <Picker.Item key={value} label={`${value}`} value={value} />
            ))}
          </Picker>
        </View>
      </View>

      <View style={styles.contactInputContainer}>
        <Text style={styles.contactTitle}>Enter Safety Timer Contacts</Text>

        {/* Always show 3 contact inputs */}
        {contacts.map((contact, index) => (
          <View key={index} style={styles.contactRow}>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.contactInput}
                placeholder={`Contact Number ${index + 1}`}
                value={contact}
                onChangeText={(text) => handleContactChange(index, text)}
                keyboardType="phone-pad"
              />
              {contact ? (
                <TouchableOpacity
                  onPress={() => handleContactChange(index, "")}
                  style={styles.iconContainer}
                >
                  <AntDesign name="delete" size={20} color="red" />
                </TouchableOpacity>
              ) : null}
            </View>
          </View>
        ))}

        {isChanged && (
          <Text style={styles.changeMessage}>
            Please save the changes to your contacts.
          </Text>
        )}

        <TouchableOpacity style={styles.button} onPress={handleSave}>
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>Start Safety Timer</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Popup Modal */}
      <Modal visible={popupVisible} transparent animationType="slide">
        <View style={styles.overlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>Are you Safe?</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.safeButton}
                onPress={handleSafeAction}
              >
                <Text style={{ color: "#fff", fontFamily: "Oxygen_Regular" }}>
                  I'm Safe
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.notSafeButton}
                onPress={handleNotSafeAction}
              >
                <Text style={{ color: "#fff" }}>I'm Not Safe</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default SecurityTimerScreen;

const styles = StyleSheet.create({
  heading: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 20,
    color: "#7A4791",
    fontFamily: "Tajawal_Bold",
  },
  safetyTimerMainContainer: {
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
    marginBottom: 5,
    fontFamily: "Oxygen_Regular",
  },
  infoImage: {
    width: "100%",
    height: 200,
    resizeMode: "contain",
    borderRadius: 10,
    marginTop: 10,
  },
  pickerContainerMain: {
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
  safetyTimerInfo: {
    marginBottom: 20,
  },
  safetyTimerInfoTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  timerTitle: {
    fontSize: 20,
    textAlign: "center",
    marginBottom: 20,
    color: "#7A4791",
    fontFamily: "Tajawal_Medium",
  },
  safetyTimerInfoBottom: {
    padding: 10,
    backgroundColor: "#e9ecef",
    borderRadius: 5,
  },
  pickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  picker: {
    height: 50,
    width: 100,
    backgroundColor: "#e9ecef",
    borderRadius: 5,
    marginHorizontal: 10,
    fontFamily: "Oxygen_Regular",
  },
  colon: {
    fontSize: 20,
    marginHorizontal: 5,
    color: "#495057",
  },
  contactInputContainer: {
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
    marginBottom: 90,
  },
  contactTitle: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
    color: "#7A4791",
    fontFamily: "Tajawal_Medium",
  },
  contactRow: {
    marginBottom: 10,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#7A4791",
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  contactInput: {
    flex: 1,
    padding: 10,
    fontSize: 14,
    color: "#7A4791",
    fontFamily: "Oxygen_Regular",
  },
  iconContainer: {
    padding: 10,
  },
  addContactButton: {
    alignItems: "center",
    padding: 10,
    backgroundColor: "#5D6D7E",
    borderRadius: 5,
    marginTop: 5,
  },
  saveButton: {
    alignItems: "center",
    padding: 15,
    backgroundColor: "#5D6D7E",
    borderRadius: 5,
    marginTop: 20,
  },
  button: {
    backgroundColor: "#9067c6",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Oxygen_Regular",
  },
  changeMessage: {
    fontSize: 14,
    color: "#f75252",
    marginTop: 5,
    textAlign: "center",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
    fontFamily: "Tajawal_Bold",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  safeButton: {
    padding: 10,
    backgroundColor: "#18CE09",
    borderRadius: 5,
    alignItems: "center",
    width: "40%",
  },
  notSafeButton: {
    padding: 10,
    backgroundColor: "red",
    borderRadius: 5,
    alignItems: "center",
    width: "40%",
  },
});
