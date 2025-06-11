import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { BabyInfo, FamilyWithData, Participant } from '../types/family';
import { babyOperations, familyOperations } from '../utils/familyFirestore';

type BabyContextType = {
  babyInfo: BabyInfo | null;
  family: FamilyWithData | null;
  familyId: string | null;
  loading: boolean;
  error: string | null;
  updateBabyInfo: (data: Partial<BabyInfo>) => Promise<void>;
  addParticipant: (participant: Participant) => Promise<void>;
  createNewFamily: (babyName: string, birthday: Date) => Promise<string>;
  setFamilyId: (familyId: string) => void;
};

// デフォルトの参加者データ（UI互換性のため）
const defaultParticipants: Participant[] = [
  { name: "ゆか", color: "#FFF" },
  { name: "けん", color: "blue" },
];

const BabyContext = createContext<BabyContextType | undefined>(undefined);

export const BabyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [family, setFamily] = useState<FamilyWithData | null>(null);
  const [babyInfo, setBabyInfo] = useState<BabyInfo | null>(null);
  const [familyId, setFamilyIdState] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 家族IDが設定されたときの初期化
  useEffect(() => {
    if (!familyId) {
      setLoading(false);
      setFamily(null);
      setBabyInfo(null);
      return;
    }

    initializeFamily(familyId);
  }, [familyId]);

  // 家族データの初期化
  const initializeFamily = async (currentFamilyId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Initializing family with ID:', currentFamilyId);
      
      // 家族データを購読
      const unsubscribe = familyOperations.subscribeToFamily(
        currentFamilyId,
        (familyData, error) => {
          if (error) {
            console.error('Error subscribing to family:', error);
            setError('家族情報の取得に失敗しました');
            setLoading(false);
            return;
          }

          if (familyData) {
            setFamily(familyData);
            
            // 最初の赤ちゃんの情報をBabyInfoに変換
            if (familyData.babies.length > 0) {
              const firstBaby = familyData.babies[0];
              const convertedBabyInfo = babyOperations.convertToBabyInfo(
                firstBaby,
                defaultParticipants
              );
              setBabyInfo(convertedBabyInfo);
            } else {
              setBabyInfo(null);
            }
          } else {
            setFamily(null);
            setBabyInfo(null);
          }
          
          setLoading(false);
        }
      );

      // クリーンアップ関数を返す
      return () => {
        console.log('Unsubscribing from family updates');
        unsubscribe();
      };
    } catch (err) {
      console.error('Error initializing family:', err);
      setError('家族情報の初期化に失敗しました');
      setLoading(false);
    }
  };

  // 赤ちゃん情報の更新
  const updateBabyInfo = async (data: Partial<BabyInfo>) => {
    try {
      setLoading(true);
      setError(null);
      
      if (!familyId || !babyInfo?.id) {
        throw new Error('Family ID or Baby ID not found');
      }
      
      // BabyInfo から Baby 形式に変換
      const updateData: any = {};
      
      if (data.name !== undefined) updateData.name = data.name;
      if (data.birthdate !== undefined) {
        updateData.birthday = new Date(data.birthdate);
      }
      if (data.weight !== undefined) updateData.currentWeight = data.weight;
      if (data.height !== undefined) updateData.currentHeight = data.height;
      
      // Firestoreの赤ちゃん情報を更新
      await babyOperations.updateBaby(familyId, babyInfo.id, updateData);
      
      console.log('Baby info updated successfully');
    } catch (err) {
      console.error('Error updating baby info:', err);
      setError('赤ちゃん情報の更新に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  // 参加者の追加（UI互換性のため、ローカルステートのみ更新）
  const addParticipant = async (participant: Participant) => {
    try {
      setLoading(true);
      
      if (!babyInfo) {
        throw new Error('Baby info not found');
      }
      
      const updatedParticipants = [...babyInfo.participants, participant];
      
      // ローカルステートを更新（実際のDBには保存しない）
      setBabyInfo({
        ...babyInfo,
        participants: updatedParticipants
      });
      
      console.log('Participant added successfully');
    } catch (err) {
      console.error('Error adding participant:', err);
      setError('参加者の追加に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  // 新しい家族の作成
  const createNewFamily = async (babyName: string, birthday: Date): Promise<string> => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Creating new family with baby:', babyName);
      const newFamilyId = await familyOperations.createFamily(babyName, birthday);
      
      // 新しい家族IDを設定（これにより useEffect が実行される）
      setFamilyIdState(newFamilyId);
      
      return newFamilyId;
    } catch (err) {
      console.error('Error creating family:', err);
      setError('家族の作成に失敗しました');
      throw err;
    }
  };

  // 家族IDの設定
  const setFamilyId = (newFamilyId: string) => {
    console.log('Setting family ID:', newFamilyId);
    setFamilyIdState(newFamilyId);
  };

  return (
    <BabyContext.Provider 
      value={{ 
        babyInfo, 
        family,
        familyId,
        loading, 
        error, 
        updateBabyInfo, 
        addParticipant,
        createNewFamily,
        setFamilyId
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