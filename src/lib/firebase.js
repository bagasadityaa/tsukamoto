// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBl_Y1fgjtsURoEUzEPHKuryBBKWnGfCmM",
  authDomain: "database-af146.firebaseapp.com",
  projectId: "database-af146",
  storageBucket: "database-af146.firebasestorage.app",
  messagingSenderId: "629815716477",
  appId: "1:629815716477:web:bd303dc74d8af7dc365f14",
  measurementId: "G-G0XLL8VTRQ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const authLib = getAuth(app);
