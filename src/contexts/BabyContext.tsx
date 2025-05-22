import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { updateBaby } from '../utils/firestoreUtils';

export type Participant = {
  name: string;
  color: string;
  uid?: string;
};

export type BabyInfo = {
  id?: string;
  name: string;
  birthdate?: string;
  weight?: number;
  height?: number;
  ageInDays: number;
  participants: Participant[];
};

type BabyContextType = {
  babyInfo: BabyInfo;
  loading: boolean;
  error: string | null;
  updateBabyInfo: (data: Partial<BabyInfo>) => Promise<void>;
  addParticipant: (participant: Participant) => Promise<void>;
};

const defaultBabyInfo: BabyInfo = {
  name: "まきちゃん",
  ageInDays: 30,
  birthdate: "2025/7/1",
  weight: 4026,
  height: 63,
  participants: [
    { name: "ゆか", color: "#FFF" },
    { name: "けん", color: "blue" },
  ],
};

const BabyContext = createContext<BabyContextType | undefined>(undefined);

export const BabyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [babyInfo, setBabyInfo] = useState<BabyInfo>(defaultBabyInfo);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 赤ちゃん情報の初期化
  useEffect(() => {
    const initializeBaby = async () => {
      try {
        setLoading(true);
        
        // DBへの接続テスト用。実際のデータ取得はTODOとして後回し
        console.log('Firebase connection test - initializing baby data');
        setBabyInfo(defaultBabyInfo);
        
        /* 実装予定
        const babyId = 'default-baby-id';
        let baby = await getBabyInfo(babyId);
        
        if (!baby) {
          const newBaby = await addBaby(defaultBabyInfo);
          setBabyInfo({...defaultBabyInfo, id: newBaby.id});
        } else {
          const babyData = {...defaultBabyInfo, ...baby};
          setBabyInfo(babyData);
        }
        */
      } catch (err) {
        console.error('Error initializing baby data:', err);
        setError('赤ちゃん情報の取得に失敗しました');
      } finally {
        setLoading(false);
      }
    };

    initializeBaby();
  }, []);

  // 誕生日から日齢を計算
  const calculateAgeInDays = (birthdate?: string) => {
    if (!birthdate) return 0;
    
    const birth = new Date(birthdate);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - birth.getTime());
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  };

  // 赤ちゃん情報の更新
  const updateBabyInfo = async (data: Partial<BabyInfo>) => {
    try {
      setLoading(true);
      
      if (!babyInfo.id) {
        throw new Error('Baby ID not found');
      }
      
      // Firestoreの赤ちゃん情報を更新
      await updateBaby(babyInfo.id, data);
      
      // ローカルの状態も更新
      const updatedInfo = { ...babyInfo, ...data };
      
      // 誕生日が変更された場合は日齢も再計算
      if (data.birthdate) {
        updatedInfo.ageInDays = calculateAgeInDays(data.birthdate);
      }
      
      setBabyInfo(updatedInfo);
    } catch (err) {
      console.error('Error updating baby info:', err);
      setError('赤ちゃん情報の更新に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  // 参加者の追加
  const addParticipant = async (participant: Participant) => {
    try {
      setLoading(true);
      
      if (!babyInfo.id) {
        throw new Error('Baby ID not found');
      }
      
      const updatedParticipants = [...babyInfo.participants, participant];
      
      // Firestoreの参加者情報を更新
      await updateBaby(babyInfo.id, { participants: updatedParticipants });
      
      // ローカルの状態も更新
      setBabyInfo({
        ...babyInfo,
        participants: updatedParticipants
      });
    } catch (err) {
      console.error('Error adding participant:', err);
      setError('参加者の追加に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <BabyContext.Provider 
      value={{ 
        babyInfo, 
        loading, 
        error, 
        updateBabyInfo, 
        addParticipant 
      }}
    >
      {children}
    </BabyContext.Provider>
  );
};

export const useBaby = () => {
  const context = useContext(BabyContext);
  if (context === undefined) {
    throw new Error('useBaby must be used within a BabyProvider');
  }
  return context;
}; 