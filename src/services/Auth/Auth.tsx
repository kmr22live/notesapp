import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCE2Xj-ZBUCCZOlrYioUPTFStNBbFL4DO4",
  authDomain: "notesapp-a.firebaseapp.com",
  projectId: "notesapp-a",
  storageBucket: "notesapp-a.appspot.com",
  messagingSenderId: "445766634607",
  appId: "1:445766634607:web:1fe47a600d33a1f1b6119a",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();
