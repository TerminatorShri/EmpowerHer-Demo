import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBj4aeig_NhQxXA-ltX7cmm7SAVBXrNPkY",
  authDomain: "empowerher-ce990.firebaseapp.com",
  projectId: "empowerher-ce990",
  storageBucket: "empowerher-ce990.firebasestorage.app",
  messagingSenderId: "489825120460",
  appId: "1:489825120460:web:15b4e47b56b5a1474b9269",
  measurementId: "G-DDBEJQR216"
};

const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;