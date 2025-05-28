import { getApp, getApps, initializeApp } from 'firebase/app';
import { collection, doc, getFirestore, serverTimestamp, setDoc } from 'firebase/firestore';
import 'react-native-get-random-values';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

// アプリが既に初期化されている場合は既存のインスタンスを使用し、
// 初期化されていない場合は新しく初期化する
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const db = getFirestore(app);

// Helper function to create a new family
export async function createFamily(babyName: string, birthday: Date) {
  // family document
  const familyRef = await doc(collection(db, 'families')); // auto ID
  await setDoc(familyRef, {
    createdAt: serverTimestamp(),
    creatorId: 'default-user', // 認証を使用しないため、デフォルト値を設定
  });
  
  // babies subcollection
  const babyRef = await doc(collection(familyRef, 'babies'));
  await setDoc(babyRef, {
    name: babyName,
    birthday,
  });
  
  // members subcollection
  await setDoc(doc(collection(familyRef, 'members'), 'default-user'), {
    role: 'dad',
    email: '',
    joinedAt: serverTimestamp(),
  });
  
  return familyRef.id;
} 