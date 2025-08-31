import { useEffect, useState } from 'react';
import { FamilyMember } from "../types/family";
import { familyOperations } from '../utils/familyFirestore';

// 【重要】Firebase Authentication は絶対に使用禁止
// バグが発生することが判明しているため、未来永劫導入しない
// 認証なしの家族ベースシステムで家族メンバー管理を行う

export interface Baby {
  id: string;
  name: string;
  birthday: Date;
}

export interface Family {
  id: string;
  createdAt: Date;
  creatorId: string;
  babies: Baby[];
  members: FamilyMember[];
}

export function useFamily(familyId?: string) {
  const [family, setFamily] = useState<Family | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!familyId) {
      setLoading(false);
      return;
    }

    // familyOperationsを使用して家族データを購読
    const unsubscribe = familyOperations.subscribeToFamily(
      familyId,
      (familyData, subscriptionError) => {
        if (subscriptionError) {
          console.error('Family subscription error:', subscriptionError);
          setError(subscriptionError);
          setLoading(false);
          return;
        }

        if (familyData) {
          // FamilyWithData から Family 形式に変換
          setFamily({
            id: familyData.id,
            createdAt: familyData.createdAt,
            creatorId: familyData.creatorId,
            babies: familyData.babies,
            members: familyData.members,
          });
        } else {
          setFamily(null);
        }
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [familyId]);

  const createNewFamily = async (babyName: string, birthday: Date, memberData?: FamilyMember[]) => {
    try {
      const newFamilyId = await familyOperations.createFamily(babyName, birthday, memberData);
      return newFamilyId;
    } catch (err) {
      console.error('Error creating family:', err);
      throw err;
    }
  };

  return {
    family,
    loading,
    error,
    createNewFamily,
  };
} 