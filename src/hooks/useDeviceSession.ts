import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';
import { familyIdResolver } from '../utils/familyIdResolver';
import { log } from '../utils/logger';

// 【重要】Firebase Authentication は絶対に使用禁止
// バグが発生することが判明しているため、未来永劫導入しない
// デバイスベースの認証システムで管理を行う

// AsyncStorage キー定義
const STORAGE_KEYS = {
  DEVICE_ID: '@baby_tracker/device_id',
  FAMILY_ID: '@baby_tracker/family_id',
  LAST_USER_ID: '@baby_tracker/last_user_id',
  IS_FIRST_TIME: '@baby_tracker/is_first_time',
  USER_SELECTION_COUNT: '@baby_tracker/user_selection_count'
} as const;

// デバイスセッション情報の型定義
export interface DeviceSession {
  deviceId: string;
  familyId: string | null;
  lastUserId: string | null;
  isFirstTime: boolean;
  userSelectionCount: number; // ユーザー選択回数（自動ログイン判定用）
}

// 簡易的なUUID生成（react-native-get-random-valuesが使用可能になるまでの暫定対応）
const generateSimpleUUID = (): string => {
  return 'device-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
};

export function useDeviceSession() {
  const [session, setSession] = useState<DeviceSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 初期化時にセッション情報を読み込み
  useEffect(() => {
    initializeSession();
  }, []);

  // セッション情報の初期化
  const initializeSession = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      log.debug('Initializing device session');
      
      // 各値を並行して取得
      const [
        deviceId,
        familyId,
        lastUserId,
        isFirstTimeStr,
        userSelectionCountStr
      ] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.DEVICE_ID),
        AsyncStorage.getItem(STORAGE_KEYS.FAMILY_ID),
        AsyncStorage.getItem(STORAGE_KEYS.LAST_USER_ID),
        AsyncStorage.getItem(STORAGE_KEYS.IS_FIRST_TIME),
        AsyncStorage.getItem(STORAGE_KEYS.USER_SELECTION_COUNT)
      ]);

      // デバイスIDが存在しない場合は生成
      const finalDeviceId = deviceId || generateSimpleUUID();
      if (!deviceId) {
        await AsyncStorage.setItem(STORAGE_KEYS.DEVICE_ID, finalDeviceId);
        log.info('Generated new device ID', { deviceId: finalDeviceId });
      }

      // 初回フラグの判定（デバイスIDが生成された = 初回）
      const isFirstTime = isFirstTimeStr === null ? !deviceId : isFirstTimeStr === 'true';
      if (isFirstTimeStr === null) {
        await AsyncStorage.setItem(STORAGE_KEYS.IS_FIRST_TIME, isFirstTime.toString());
      }

      const sessionData: DeviceSession = {
        deviceId: finalDeviceId,
        familyId: familyId || null,
        lastUserId: lastUserId || null,
        isFirstTime,
        userSelectionCount: parseInt(userSelectionCountStr || '0', 10)
      };

      setSession(sessionData);
      
      log.info('Device session initialized', {
        deviceId: finalDeviceId,
        familyId: familyId || 'none',
        isFirstTime,
        userSelectionCount: sessionData.userSelectionCount
      });
      
    } catch (err) {
      log.error('Error initializing device session', err);
      setError('デバイス情報の初期化に失敗しました');
    } finally {
      setLoading(false);
    }
  }, []);

  // 家族IDの保存（統一システム使用版）
  const saveFamilyId = useCallback(async (familyId: string) => {
    try {
      log.debug('Saving family ID via unified system', { familyId });
      
      // 統一システムを使って家族IDを更新
      const wasUpdated = await familyIdResolver.updateFamilyId(familyId);
      
      if (!wasUpdated) {
        // 既に同じIDまたは更新中の場合
        return;
      }
      
      // 初回フラグをfalseに設定
      await AsyncStorage.setItem(STORAGE_KEYS.IS_FIRST_TIME, 'false');
      
      // 状態を更新
      setSession(prev => {
        if (prev && prev.familyId !== familyId) {
          log.info('Device session updated with family ID', { familyId });
          return {
            ...prev,
            familyId,
            isFirstTime: false
          };
        }
        return prev;
      });
      
    } catch (err) {
      log.error('Error saving family ID', err);
      throw new Error('家族IDの保存に失敗しました');
    }
  }, []);

  // 最後に選択したユーザーIDの保存
  const saveLastUserId = useCallback(async (userId: string) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.LAST_USER_ID, userId);
      
      // ユーザー選択回数をインクリメント
      const newCount = (session?.userSelectionCount || 0) + 1;
      await AsyncStorage.setItem(STORAGE_KEYS.USER_SELECTION_COUNT, newCount.toString());
      
      setSession(prev => prev ? {
        ...prev,
        lastUserId: userId,
        userSelectionCount: newCount
      } : null);
      
      log.debug('Last user ID saved', { userId, selectionCount: newCount });
    } catch (err) {
      log.error('Error saving last user ID', err);
      throw new Error('ユーザー選択の保存に失敗しました');
    }
  }, [session?.userSelectionCount]);

  // 自動ログイン可能かどうかの判定
  const canAutoLogin = useCallback((): boolean => {
    if (!session) return false;
    
    // 3回目以降のログインで、家族ID・ユーザーIDが両方存在する場合
    const canAuto = session.userSelectionCount >= 2 && 
                   session.familyId !== null && 
                   session.lastUserId !== null;
    
    log.debug('Auto login check', {
      canAuto,
      userSelectionCount: session.userSelectionCount,
      hasFamilyId: !!session.familyId,
      hasLastUserId: !!session.lastUserId
    });
    
    return canAuto;
  }, [session]);

  // セッションリセット（開発時・デバッグ用）
  const resetSession = useCallback(async () => {
    try {
      await Promise.all([
        AsyncStorage.removeItem(STORAGE_KEYS.DEVICE_ID),
        AsyncStorage.removeItem(STORAGE_KEYS.FAMILY_ID),
        AsyncStorage.removeItem(STORAGE_KEYS.LAST_USER_ID),
        AsyncStorage.removeItem(STORAGE_KEYS.IS_FIRST_TIME),
        AsyncStorage.removeItem(STORAGE_KEYS.USER_SELECTION_COUNT)
      ]);
      
      log.info('Session reset completed');
      await initializeSession();
    } catch (err) {
      log.error('Error resetting session', err);
      setError('セッションのリセットに失敗しました');
    }
  }, [initializeSession]);

  return {
    session,
    loading,
    error,
    saveFamilyId,
    saveLastUserId,
    canAutoLogin,
    resetSession, // 開発用
  };
} 