import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { Baby, BabyInfo, FamilyMember, FamilyWithData, Participant } from '../types/family';
import { babyOperations, familyOperations } from '../utils/familyFirestore';
import { familyIdResolver } from '../utils/familyIdResolver';
import { log } from '../utils/logger';

type BabyContextType = {
  babyInfo: BabyInfo | null;
  family: FamilyWithData | null;
  familyId: string | null;
  currentUser: { displayName: string; color: string; role: string } | null; // 現在のユーザー情報
  loading: boolean;
  error: string | null;
  updateBabyInfo: (data: Partial<BabyInfo>) => Promise<void>;
  addParticipant: (participant: Participant) => Promise<void>;
  createNewFamily: (babyName: string, birthday: Date, memberData?: FamilyMember[]) => Promise<string>;
  setFamilyId: (familyId: string) => void;
};

const BabyContext = createContext<BabyContextType | undefined>(undefined);

export const BabyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [family, setFamily] = useState<FamilyWithData | null>(null);
  const [babyInfo, setBabyInfo] = useState<BabyInfo | null>(null);
  const [familyId, setFamilyIdState] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<{ displayName: string; color: string; role: string } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [didRecoverOnce, setDidRecoverOnce] = useState<boolean>(false);

  // 家族IDが設定されたときの初期化
  useEffect(() => {
    if (!familyId) {
      setLoading(false);
      setFamily(null);
      setBabyInfo(null);
      setCurrentUser(null);
      return;
    }

    initializeFamily(familyId);
  }, [familyId]);

  // babyInfoの変更を監視
  useEffect(() => {
    if (babyInfo) {
      log.debug('Baby info changed', {
        weight: babyInfo.weight,
        height: babyInfo.height,
        name: babyInfo.name
      });
    }
  }, [babyInfo]);

  // 家族データの初期化
  const initializeFamily = async (currentFamilyId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      log.debug('Initializing family', { familyId: currentFamilyId });
      
      // 家族データを購読
      const unsubscribe = familyOperations.subscribeToFamily(
        currentFamilyId,
        async (familyData, error) => {
          if (error) {
            log.error('Error subscribing to family', error);
            // 自動復旧：一度だけ新規家族を作成してやり直す
            if (!didRecoverOnce) {
              try {
                setDidRecoverOnce(true);
                log.debug('Attempting automatic family recovery (create new family)');
                const newFamilyId = await familyOperations.createFamily('赤ちゃん', new Date());
                // 統一システム経由でfamilyIdを更新
                setFamilyId(newFamilyId);
                return;
              } catch (e) {
                log.error('Automatic family recovery failed', e as any);
              }
            }
            setError('家族情報の取得に失敗しました');
            setLoading(false);
            return;
          }

          if (familyData) {
            log.debug('Family data received from Firestore', {
              babies: familyData.babies.map(baby => ({
                id: baby.id,
                name: baby.name,
                currentWeight: baby.currentWeight,
                currentHeight: baby.currentHeight
              }))
            });
            
            setFamily(familyData);
            
            // 現在のユーザーを特定
            const currentMember = familyData.members.find(member => member.isCurrentUser);
            if (currentMember) {
              setCurrentUser({
                displayName: currentMember.displayName,
                color: currentMember.color,
                role: currentMember.role
              });
            }
            
            // 家族メンバーから参加者リストを作成
            const participants: Participant[] = familyData.members.map(member => ({
              name: member.displayName,
              color: member.color,
              uid: member.id
            }));
            
            // 最初の赤ちゃんの情報をBabyInfoに変換
            if (familyData.babies.length > 0) {
              const firstBaby = familyData.babies[0];
              const convertedBabyInfo = babyOperations.convertToBabyInfo(
                firstBaby,
                participants // 実際の家族メンバーを使用
              );
              log.debug('Converting baby info', {
                original: {
                  currentWeight: firstBaby.currentWeight,
                  currentHeight: firstBaby.currentHeight
                },
                converted: {
                  weight: convertedBabyInfo.weight,
                  height: convertedBabyInfo.height
                }
              });
              setBabyInfo(convertedBabyInfo);
            } else {
              setBabyInfo(null);
            }
          } else {
            // familyドキュメントが存在しない場合も自動復旧を試行
            if (!didRecoverOnce) {
              try {
                setDidRecoverOnce(true);
                log.debug('Family missing, attempting automatic family recovery (create new family)');
                const newFamilyId = await familyOperations.createFamily('赤ちゃん', new Date());
                setFamilyId(newFamilyId);
                return;
              } catch (e) {
                log.error('Automatic family recovery failed', e as any);
              }
            }
            setFamily(null);
            setBabyInfo(null);
            setCurrentUser(null);
          }
          
          setLoading(false);
        }
      );

      // クリーンアップ関数を返す
      return () => {
        log.debug('Unsubscribing from family updates');
        unsubscribe();
      };
    } catch (err) {
      log.error('Error initializing family', err);
      setError('家族情報の初期化に失敗しました');
      setLoading(false);
    }
  };

  // 赤ちゃん情報の更新
  const updateBabyInfo = async (data: Partial<BabyInfo>) => {
    try {
      setLoading(true);
      setError(null);
      
      if (!familyId) {
        throw new Error('Family ID not found');
      }
      
      log.debug('Updating baby info', {
        current: {
          weight: babyInfo?.weight,
          height: babyInfo?.height
        },
        update: data
      });
      
      // BabyInfo から Baby 形式に変換
      const updateData: Partial<Baby> = {};
      
      if (data.name !== undefined) updateData.name = data.name;
      if (data.birthdate !== undefined) {
        updateData.birthday = new Date(data.birthdate);
      }
      if (data.weight !== undefined) updateData.currentWeight = data.weight;
      if (data.height !== undefined) updateData.currentHeight = data.height;
      
      log.debug('Firestore update data', updateData);
      
      // 更新対象のbabyIdを解決（購読中オブジェクトが空の可能性に備える）
      let targetBabyId = babyInfo?.id;
      if (!targetBabyId) {
        log.debug('Resolving babyId from Firestore because local babyInfo.id is missing');
        const family = await familyOperations.getFamily(familyId);
        if (!family || family.babies.length === 0) {
          throw new Error('No baby document found to update');
        }
        targetBabyId = family.babies[0].id;
      }
      
      // まずは通常のupdate（ドキュメントがある前提）
      try {
        await babyOperations.updateBaby(familyId, targetBabyId!, updateData);
      } catch (err: any) {
        // not-found の場合のみ作成（merge）にフォールバック
        if (err?.code === 'not-found') {
          log.debug('Baby doc not found, creating with initial data (merge)');
          const babyRefData: Partial<Baby> = {
            ...updateData,
          };
          const { doc, collection, setDoc, serverTimestamp } = await import('firebase/firestore');
          const { db } = await import('../firebaseConfig');
          const babyRef = doc(collection(db, 'families', familyId, 'babies'), targetBabyId!);
          await setDoc(
            babyRef,
            {
              ...babyRefData,
              updatedAt: serverTimestamp(),
            },
            { merge: true }
          );
        } else {
          throw err;
        }
      }
      
      log.info('Baby info updated successfully in Firestore');
      
      // ローカル状態も即座に更新（UIの即座な反映のため）
      if (babyInfo) {
        const updatedBabyInfo = {
          ...babyInfo,
          ...data
        };
        log.debug('Updating local baby info', {
          from: {
            weight: babyInfo.weight,
            height: babyInfo.height
          },
          to: {
            weight: updatedBabyInfo.weight,
            height: updatedBabyInfo.height
          }
        });
        setBabyInfo(updatedBabyInfo);
      }
      
    } catch (err) {
      log.error('Error updating baby info', err as any);
      setError('赤ちゃん情報の更新に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  // 参加者の追加（家族メンバーに追加）
  const addParticipant = async (participant: Participant) => {
    try {
      setLoading(true);
      
      if (!babyInfo) {
        throw new Error('Baby info not found');
      }
      
      // 既存の参加者リストに追加（ローカルステートのみ）
      const updatedParticipants = [...babyInfo.participants, participant];
      
      setBabyInfo({
        ...babyInfo,
        participants: updatedParticipants
      });
      
      log.info('Participant added successfully');
    } catch (err) {
      log.error('Error adding participant', err);
      setError('参加者の追加に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  // 新しい家族の作成（拡張版）
  const createNewFamily = async (babyName: string, birthday: Date, memberData?: FamilyMember[]): Promise<string> => {
    try {
      setLoading(true);
      setError(null);
      
      log.debug('Creating new family with baby', { babyName, memberData });
      const newFamilyId = await familyOperations.createFamily(babyName, birthday, memberData);
      
      // 家族IDの設定は外部で行う（無限ループを避けるため）
      // setFamilyIdState(newFamilyId); // 削除
      
      return newFamilyId;
    } catch (err) {
      log.error('Error creating family', err);
      setError('家族の作成に失敗しました');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 家族IDの設定（統一システム使用版 - 安全な非同期実行）
  const setFamilyId = (newFamilyId: string) => {
    log.debug('Setting family ID via unified system', newFamilyId);
    
    // 非同期処理を内部で実行（awaitしない）
    familyIdResolver.updateFamilyId(newFamilyId)
      .then((wasUpdated) => {
        if (wasUpdated) {
          // 実際に更新された場合のみローカル状態を更新
          setFamilyIdState(newFamilyId);
        } else {
          log.warn('Family ID not updated (already set or updating)');
          // 統一システムで更新されなかった場合でも、ローカル状態は同期
          if (familyIdResolver.getCurrentFamilyId() === newFamilyId) {
            setFamilyIdState(newFamilyId);
          }
        }
      })
      .catch((err) => {
        log.error('Error setting family ID', err);
        // エラーの場合でもローカル状態は更新（フォールバック）
        setFamilyIdState(newFamilyId);
      });
  };

  return (
    <BabyContext.Provider 
      value={{ 
        babyInfo, 
        family,
        familyId,
        currentUser,
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