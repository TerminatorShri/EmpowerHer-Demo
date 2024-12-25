import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  getIdToken,
} from "firebase/auth";
import { auth, firestore } from "../../config/firebase.config";
import {
  setDoc,
  doc,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import AppData from "../../../assets/AppAssets.json";

/**
 * Log in a user with email and password
 * @param email - User's email
 * @param password - User's password
 */
const loginUser = async (email: string, password: string) => {
  try {
    // Sign in the user with Firebase Authentication
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    const accessToken = await getIdToken(user, true);

    return { user, accessToken };
  } catch (error) {
    throw error;
  }
};

/**
 * Register a new user
 * @param email - User's email
 * @param password - User's password
 * @param username - User's chosen username
 */
const registerUser = async (
  email: string,
  password: string,
  username: string
) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    const accessToken = await getIdToken(user, true);

    const randomIndx = Math.floor(
      Math.random() * AppData.profilePictures.length
    );
    const randomProfilePic = AppData.profilePictures[randomIndx];

    const userData = {
      uid: user.uid,
      email: user.email,
      username,
      profilePhotoUrl: randomProfilePic,
      contactNumber: "",
      SOSButtonContacts: ["", "", ""],
      SafetyTimerContacts: ["", "", ""],
      SafetyTimerInterval: [0, 15],
      savedPosts: [],
      createdAt: new Date(),
    };

    await setDoc(doc(firestore, "users", user.uid), userData);

    return { user, accessToken };
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

const refreshAccessToken = async () => {
  const currentUser = auth.currentUser;
  if (currentUser) {
    const newIdToken = await currentUser.getIdToken(true);
    console.log("New access token:", newIdToken);
    return newIdToken;
  } else {
    throw new Error("No active user session found.");
  }
};

const getCurrentUserInfomation = async (uid: string) => {
  try {
    const usersRef = collection(firestore, "users");
    const q = query(usersRef, where("uid", "==", uid));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const userData = querySnapshot.docs[0].data();
      return userData;
    } else {
      throw new Error("No user found with the given UID.");
    }
  } catch (error) {
    console.error("Error getting user information:", error);
    throw error;
  }
};

/**
 * Updates the username for a user in the Firestore database.
 * @param uid - The user's unique ID.
 * @param username - The new username to update.
 * @returns A promise that resolves to true if the update was successful, otherwise false.
 */
const updateUserName = async (
  uid: string,
  username: string
): Promise<boolean> => {
  if (!uid || !username) {
    console.error("Invalid inputs: UID or username is missing.");
    return false;
  }

  try {
    const userDocRef = doc(firestore, "users", uid);
    await updateDoc(userDocRef, { username });
    console.log("Username updated successfully.");

    return true;
  } catch (error) {
    console.error("Error updating username:", error);
    return false;
  }
};

const updateContactNumber = async (
  uid: string,
  contactNumber: string
): Promise<boolean> => {
  if (!uid) {
    console.error("Invalid inputs: uid or contact number is missing.");
    return false;
  }
  try {
    const userDocRef = doc(firestore, "users", uid);
    await updateDoc(userDocRef, { contactNumber });
    console.log("Contact number updated successfully.");
    return true;
  } catch (error) {
    console.error("Error updating contact number:", error);
    return false;
  }
};

export {
  loginUser,
  registerUser,
  refreshAccessToken,
  getCurrentUserInfomation,
  updateUserName,
  updateContactNumber,
};
