// Import the functions you need from the SDKs you need
import { getAnalytics, isSupported } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAI8W0_X2xAkwnGEtvy7fkCmy2dQbFVja8",
  authDomain: "baby-tracker-app-6e434.firebaseapp.com",
  projectId: "baby-tracker-app-6e434",
  storageBucket: "baby-tracker-app-6e434.firebasestorage.app",
  messagingSenderId: "212633278643",
  appId: "1:212633278643:web:7d4e62d1fe3aedfc7778c6",
  measurementId: "G-H20C66VD3N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics only in supported environments
const initializeAnalytics = async () => {
  try {
    if (await isSupported()) {
      return getAnalytics(app);
    }
    return null;
  } catch (e) {
    console.warn('Analytics not supported in this environment');
    return null;
  }
};

// Initialize Firestore
const db = getFirestore(app);

export { app, db, initializeAnalytics };
export default firebaseConfig;