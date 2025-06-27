import { useCallback } from 'react';
import { useBaby } from '../contexts/BabyContext';
import { Record, SleepRecord } from '../types/family';
import { recordOperations } from '../utils/familyFirestore';

// 【重要】Firebase Authentication は絶対に使用禁止
// バグが発生することが判明しているため、未来永劫導入しない
// 認証なしの家族ベースシステムでレコード管理を行う

export function useRecords() {
  const { familyId, babyInfo, currentUser } = useBaby();

  // 授乳記録の追加
  const addFeedingRecord = useCallback(async (data: {
    timestamp: Date;
    method: 'breast' | 'bottle' | 'mixed';
    amount?: number;
    duration?: number;
    leftBreast?: number;
    rightBreast?: number;
    notes?: string;
  }) => {
    if (!familyId || !babyInfo?.id) {
      throw new Error('Family ID or Baby ID not found');
    }

    console.log('Adding feeding record for user:', currentUser?.displayName);
    
    return await recordOperations.addFeedingRecord(familyId, babyInfo.id, data);
  }, [familyId, babyInfo?.id, currentUser]);

  // おむつ記録の追加
  const addDiaperRecord = useCallback(async (data: {
    timestamp: Date;
    wetness: boolean;
    bowelMovement: boolean;
    notes?: string;
  }) => {
    if (!familyId || !babyInfo?.id) {
      throw new Error('Family ID or Baby ID not found');
    }

    console.log('Adding diaper record for user:', currentUser?.displayName);
    
    return await recordOperations.addDiaperRecord(familyId, babyInfo.id, data);
  }, [familyId, babyInfo?.id, currentUser]);

  // 睡眠記録の追加
  const addSleepRecord = useCallback(async (data: {
    startTime: Date;
    endTime?: Date;
    duration?: number;
    notes?: string;
  }) => {
    if (!familyId || !babyInfo?.id) {
      throw new Error('Family ID or Baby ID not found');
    }

    console.log('Adding sleep record for user:', currentUser?.displayName);
    
    return await recordOperations.addSleepRecord(familyId, babyInfo.id, data);
  }, [familyId, babyInfo?.id, currentUser]);

  // 起床記録の追加
  const addWakeupRecord = useCallback(async (data: {
    timestamp: Date;
    notes?: string;
  }) => {
    if (!familyId || !babyInfo?.id) {
      throw new Error('Family ID or Baby ID not found');
    }

    console.log('Adding wakeup record for user:', currentUser?.displayName);
    
    return await recordOperations.addWakeupRecord(familyId, babyInfo.id, data);
  }, [familyId, babyInfo?.id, currentUser]);

  // 睡眠記録の更新（起床時）
  const updateSleepRecord = useCallback(async (recordId: string, data: Partial<SleepRecord>) => {
    if (!familyId || !babyInfo?.id) {
      throw new Error('Family ID or Baby ID not found');
    }

    console.log('Updating sleep record for user:', currentUser?.displayName);
    
    return await recordOperations.updateSleepRecord(familyId, babyInfo.id, recordId, data);
  }, [familyId, babyInfo?.id, currentUser]);

  // 測定記録の追加
  const addMeasurementRecord = useCallback(async (data: {
    timestamp: Date;
    measurementType: 'weight' | 'height' | 'temperature';
    value: number;
    unit: string;
    notes?: string;
  }) => {
    if (!familyId || !babyInfo?.id) {
      throw new Error('Family ID or Baby ID not found');
    }

    console.log('Adding measurement record for user:', currentUser?.displayName);
    
    return await recordOperations.addMeasurementRecord(familyId, babyInfo.id, data);
  }, [familyId, babyInfo?.id, currentUser]);

  // レコードの取得
  const getRecords = useCallback(async (recordType?: string, limit: number = 50) => {
    if (!familyId || !babyInfo?.id) {
      throw new Error('Family ID or Baby ID not found');
    }
    
    return await recordOperations.getRecords(familyId, babyInfo.id, recordType, limit);
  }, [familyId, babyInfo?.id]);

  // レコードの購読
  const subscribeToRecords = useCallback((callback: (records: Record[]) => void, recordType?: string) => {
    if (!familyId || !babyInfo?.id) {
      console.error('Family ID or Baby ID not found for subscription');
      return () => {};
    }
    
    return recordOperations.subscribeToRecords(familyId, babyInfo.id, callback, recordType);
  }, [familyId, babyInfo?.id]);

  return {
    // 現在のユーザー情報
    currentUser,
    
    // レコード作成
    addFeedingRecord,
    addDiaperRecord,
    addSleepRecord,
    addWakeupRecord,
    updateSleepRecord,
    addMeasurementRecord,
    
    // レコード取得
    getRecords,
    subscribeToRecords,
    
    // 家族・赤ちゃん情報
    familyId,
    babyInfo,
  };
} 