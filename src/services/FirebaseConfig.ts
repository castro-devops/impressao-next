// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
const apiKey = process.env.NEXT_PUBLIC_API_KEY_FIREBASE;
const firebaseConfig = {
  apiKey: apiKey,
  authDomain: "maketplace-a3193.firebaseapp.com",
  projectId: "maketplace-a3193",
  storageBucket: "maketplace-a3193.firebasestorage.app",
  messagingSenderId: "341375349818",
  appId: "1:341375349818:web:bba8e8e79bd784f1d37103",
  measurementId: "G-BJ2QM49KXS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);