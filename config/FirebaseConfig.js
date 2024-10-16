// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: "findpet-6dffe.firebaseapp.com",
  projectId: "findpet-6dffe",
  storageBucket: "findpet-6dffe.appspot.com",
  messagingSenderId: "241953655092",
  appId: "1:241953655092:web:0c8063e742076e153e7d61",
  measurementId: "G-3H51Z2PXY5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)
export const storage=getStorage(app)
// const analytics = getAnalytics(app);