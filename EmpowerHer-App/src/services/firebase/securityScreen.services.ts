import { firestore } from "../../config/firebase.config";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  where,
  query,
  getDocs,
} from "firebase/firestore";
import {
  SOSButtonReportInfomation,
  IncidentReportingFormValues,
} from "../../types/types";

const getSOSButtonInformation = async (userId: string) => {
  try {
    const sosButtonInfoRef = collection(firestore, "sosButtonInfo");
    const q = query(sosButtonInfoRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);

    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log("Fetched SOS button information:", data);
    return data;
  } catch (error) {
    console.error("Error fetching SOS button information:", error);
    throw error;
  }
};

const getSafetyTimerInformation = async (userId: string) => {
  try {
    const safetyTimerInfoRef = collection(firestore, "safetyTimerInfo");
    const q = query(safetyTimerInfoRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);

    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log("Fetched safety timer information:", data);
    return data;
  } catch (error) {
    console.error("Error fetching safety timer information:", error);
    throw error;
  }
};

const saveSOSButtonReport = async (
  data: SOSButtonReportInfomation
): Promise<{ reportId: string }> => {
  try {
    const sosButtonReportsRef = collection(firestore, "sosButtonReports");
    const docRef = await addDoc(sosButtonReportsRef, data);
    console.log("SOS button report saved successfully!", docRef.id);
    return {
      reportId: docRef.id,
    };
  } catch (error) {
    console.error("Error saving SOS button report:", error);
    throw error;
  }
};

const saveIncidentReport = async (data: IncidentReportingFormValues) => {
  try {
    const incidentsRef = collection(firestore, "incidentReports");
    await addDoc(incidentsRef, data);
    console.log("Incident report saved successfully!");
  } catch (error) {
    console.error("Error saving incident report:", error);
    throw error;
  }
};

const saveSafetyTimerReport = async (data: any) => {
  try {
    const safetyTimerReportsRef = collection(firestore, "safetyTimerReports");
    await addDoc(safetyTimerReportsRef, data);
    console.log("Safety timer report saved successfully!");
  } catch (error) {
    console.error("Error saving safety timer report:", error);
    throw error;
  }
};

const updateUserData = async (
  uid: string,
  data: Partial<{
    SOSButtonContacts: string[];
    SafetyTimerContacts: string[];
    SafetyTimerInterval: number[];
  }>
): Promise<boolean> => {
  try {
    const userDocRef = doc(firestore, "users", uid);
    await updateDoc(userDocRef, data);
    console.log("User data updated successfully!");
    return true;
  } catch (error) {
    console.error("Error updating user data:", error);
    return false;
  }
};

export {
  getSOSButtonInformation,
  getSafetyTimerInformation,
  saveSOSButtonReport,
  saveIncidentReport,
  saveSafetyTimerReport,
  updateUserData,
};
