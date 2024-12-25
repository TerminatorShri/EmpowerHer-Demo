import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db , auth } from "../config/firebase.config"; // Firebase config and db initialization
import { useDispatch } from "react-redux";

export const authenticateUser = async (email, password) => {
  // const dispatch = useDispatch();

  try {
    // Firebase Authentication - Sign in with email and password
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Fetch the user's role from Firestore based on their user ID
    const userDocRef = doc(db, "allowedUsers", user.uid); // Assuming user data is stored in 'users' collection
    const userDoc = await getDoc(userDocRef);
    const userUID = user.uid;
    if (userDoc.exists()) {
      const userData = userDoc.data();

      return { role: userData.role, isAuthenticated: true, uid: userUID }; // role and auth status
    } else {
      throw new Error("User data not found in Firestore.");
    }
  } catch (error) {
    console.error("Error logging in:", error.message);
    throw error; // Throw error for handling in component
  }
};


// import { signInWithEmailAndPassword } from "firebase/auth";
// import { doc, getDoc } from "firebase/firestore";
// import { db, auth } from "../config/firebase.config";
// import { login } from "../store/authSlice"; // Adjust path based on your project structure
// import { useDispatch } from "react-redux";

// export const authenticateUser = async (email, password) => {
//   const dispatch = useDispatch();

//   try {
//     // Firebase Authentication - Sign in with email and password
//     const userCredential = await signInWithEmailAndPassword(auth, email, password);
//     const user = userCredential.user;

//     // Fetch the user's role from Firestore based on their user ID
//     const userDocRef = doc(db, "allowedUsers", user.uid);
//     const userDoc = await getDoc(userDocRef);
//     const userUID = user.uid;

//     if (userDoc.exists()) {
//       const userData = userDoc.data();

//       // Dispatch the user data to Redux
//       dispatch(
//         setUser({
//           uid: userUID,
//           role: userData.role,
//           isAuthenticated: true,
//         })
//       );

//       return { role: userData.role, isAuthenticated: true, uid: userUID }; // role and auth status
//     } else {
//       throw new Error("User data not found in Firestore.");
//     }
//   } catch (error) {
//     console.error("Error logging in:", error.message);
//     throw error; // Throw error for handling in component
//   }
// };
