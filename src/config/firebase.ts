import { getApps, initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebaseの設定
const firebaseConfig = {
    apiKey: "AIzaSyAI8W0_X2xAkwnGEtvy7fkCmy2dQbFVja8",
    authDomain: "baby-tracker-app-6e434.firebaseapp.com",
    projectId: "baby-tracker-app-6e434",
    storageBucket: "baby-tracker-app-6e434.firebasestorage.app",
    messagingSenderId: "212633278643",
    appId: "1:212633278643:web:7d4e62d1fe3aedfc7778c6"
};

// Firebaseの初期化（重複初期化を防ぐ）
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// 各サービスのインスタンスを取得
export const db = getFirestore(app);
export const storage = getStorage(app);

console.log('Firebase initialized successfully');

export default app; 