import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { app as firebaseApp } from './firebaseConfig';

// Initialize Firebase if it's not already initialized
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseApp.options);
}

// Get references
const app = firebase.app();
const auth = firebase.auth();
const db = firebase.firestore();

export { app, auth, db };

