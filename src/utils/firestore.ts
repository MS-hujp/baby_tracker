import { addDoc, collection, deleteDoc, doc, getDocs, orderBy, query, updateDoc, where } from 'firebase/firestore';
import { db } from '../config/firebase';

// 赤ちゃんの型定義
export interface Baby {
  id?: string;
  name: string;
  birthDate: Date;
  gender: 'male' | 'female' | 'other';
  weight?: number;  // kg
  height?: number;  // cm
  createdAt: Date;
  updatedAt: Date;
}

// 記録の種類
export type RecordType = 'milk' | 'breast' | 'diaper' | 'sleep' | 'memo';

// 記録の型定義
export interface Record {
  id?: string;
  babyId: string;
  type: RecordType;
  startTime: Date;
  endTime?: Date;
  amount?: number;  // milk(ml), weight(g)など
  memo?: string;
  createdAt: Date;
  updatedAt: Date;
}

// 赤ちゃんの操作関数
export const babyOperations = {
  // 赤ちゃんの追加
  async addBaby(baby: Omit<Baby, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const now = new Date();
    const docRef = await addDoc(collection(db, 'babies'), {
      ...baby,
      createdAt: now,
      updatedAt: now,
    });
    return docRef.id;
  },

  // 赤ちゃんの一覧取得
  async getBabies(): Promise<Baby[]> {
    const querySnapshot = await getDocs(collection(db, 'babies'));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      birthDate: doc.data().birthDate.toDate(),
      createdAt: doc.data().createdAt.toDate(),
      updatedAt: doc.data().updatedAt.toDate(),
    } as Baby));
  },

  // 赤ちゃんの更新
  async updateBaby(id: string, data: Partial<Omit<Baby, 'id' | 'createdAt' | 'updatedAt'>>): Promise<void> {
    const ref = doc(db, 'babies', id);
    await updateDoc(ref, {
      ...data,
      updatedAt: new Date(),
    });
  },

  // 赤ちゃんの削除
  async deleteBaby(id: string): Promise<void> {
    await deleteDoc(doc(db, 'babies', id));
  },
};

// 記録の操作関数
export const recordOperations = {
  // 記録の追加
  async addRecord(record: Omit<Record, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const now = new Date();
    const docRef = await addDoc(collection(db, 'records'), {
      ...record,
      createdAt: now,
      updatedAt: now,
    });
    return docRef.id;
  },

  // 記録の取得（特定の赤ちゃんの、指定期間の記録）
  async getRecords(babyId: string, startDate?: Date, endDate?: Date): Promise<Record[]> {
    let q = query(
      collection(db, 'records'),
      where('babyId', '==', babyId),
      orderBy('startTime', 'desc')
    );

    if (startDate) {
      q = query(q, where('startTime', '>=', startDate));
    }
    if (endDate) {
      q = query(q, where('startTime', '<=', endDate));
    }

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      startTime: doc.data().startTime.toDate(),
      endTime: doc.data().endTime?.toDate(),
      createdAt: doc.data().createdAt.toDate(),
      updatedAt: doc.data().updatedAt.toDate(),
    } as Record));
  },

  // 記録の更新
  async updateRecord(id: string, data: Partial<Omit<Record, 'id' | 'createdAt' | 'updatedAt'>>): Promise<void> {
    const ref = doc(db, 'records', id);
    await updateDoc(ref, {
      ...data,
      updatedAt: new Date(),
    });
  },

  // 記録の削除
  async deleteRecord(id: string): Promise<void> {
    await deleteDoc(doc(db, 'records', id));
  },
}; 