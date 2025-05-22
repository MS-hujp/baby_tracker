// Import the functions you need from the SDKs you need
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
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
const analytics = getAnalytics(app);

export default firebaseConfig; 