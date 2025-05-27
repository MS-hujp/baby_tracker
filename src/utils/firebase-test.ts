import { addDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';

export const testFirebaseConnection = async () => {
  try {
    console.log('Testing Firebase connection...');
    
    // 簡単なテストドキュメントを追加
    const testData = {
      message: 'Firebase connection test',
      timestamp: new Date()
    };
    
    const docRef = await addDoc(collection(db, 'test'), testData);
    console.log('✅ Test document added with ID:', docRef.id);
    
    // テストコレクションを読み取り
    const querySnapshot = await getDocs(collection(db, 'test'));
    console.log('✅ Test collection read successfully, documents:', querySnapshot.size);
    
    return true;
  } catch (error) {
    console.error('❌ Firebase connection failed:', error);
    return false;
  }
}; 