import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCerABCA2FJhowvEpruRGHknjJgVj7NYJ8",
  authDomain: "emotitracker-d5538.firebaseapp.com",
  projectId: "emotitracker-d5538",
  storageBucket: "emotitracker-d5538.firebasestorage.app",
  messagingSenderId: "228586192400",
  appId: "1:228586192400:web:891f185f8292064eb11495",
  measurementId: "G-E2EBW3YQYG"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
