import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { Platform } from 'react-native';
import { db } from '../firebaseConfig';
import { FamilyMember } from '../types/family';
import { log } from './logger';

// 【重要】Firebase Authentication は絶対に使用禁止
// バグが発生することが判明しているため、未来永劫導入しない
// デバイスベースの認証システムで管理を行う

// デバイス登録情報の型定義
export interface DeviceRegistration {
  deviceId: string;
  familyId: string;
  registeredAt: Date;
  lastAccessAt: Date;
  deviceInfo?: {
    platform: string;
    model: string;
  };
}

// デバイス認証関連のユーティリティ
export const deviceAuth = {
  
  // Firestoreにデバイスを登録
  async registerDevice(
    deviceId: string, 
    familyId: string, 
    deviceInfo?: { platform: string; model: string }
  ): Promise<void> {
    try {
      log.info('Registering device', { deviceId, familyId });
      
      const deviceRef = doc(db, 'families', familyId, 'devices', deviceId);
      
      const registrationData = {
        deviceId,
        familyId,
        registeredAt: serverTimestamp(),
        lastAccessAt: serverTimestamp(),
        ...(deviceInfo && { deviceInfo })
      };
      
      await setDoc(deviceRef, registrationData);
      
      log.info('Device registration completed');
      
    } catch (error) {
      log.error('Error registering device', error);
      throw new Error('デバイスの登録に失敗しました');
    }
  },

  // デバイスの登録状況を確認
  async checkDeviceRegistration(deviceId: string, familyId: string): Promise<boolean> {
    try {
      log.debug('Checking device registration', { deviceId });
      
      const deviceRef = doc(db, 'families', familyId, 'devices', deviceId);
      const deviceDoc = await getDoc(deviceRef);
      
      const isRegistered = deviceDoc.exists();
      log.debug('Device registration status', { deviceId, isRegistered });
      
      return isRegistered;
      
    } catch (error) {
      log.error('Error checking device registration', error);
      return false;
    }
  },

  // デバイスのアクセス時刻を更新
  async updateLastAccess(deviceId: string, familyId: string): Promise<void> {
    try {
      log.debug('Updating last access for device', { deviceId });
      
      const deviceRef = doc(db, 'families', familyId, 'devices', deviceId);
      
      // ドキュメントが存在する場合のみ更新
      const deviceDoc = await getDoc(deviceRef);
      if (deviceDoc.exists()) {
        await setDoc(deviceRef, {
          lastAccessAt: serverTimestamp()
        }, { merge: true });
        
        log.debug('Last access updated', { deviceId });
      }
      
    } catch (error) {
      log.error('Error updating last access', error);
      // アクセス時刻更新の失敗は致命的ではないので、エラーを投げない
    }
  },

  // 家族メンバーから特定のユーザーを取得
  async getFamilyMemberById(familyId: string, userId: string): Promise<FamilyMember | null> {
    try {
      log.debug('Getting family member', { userId, familyId });
      
      const memberRef = doc(db, 'families', familyId, 'members', userId);
      const memberDoc = await getDoc(memberRef);
      
      if (memberDoc.exists()) {
        const data = memberDoc.data();
        const member: FamilyMember = {
          id: memberDoc.id,
          displayName: data.displayName,
          role: data.role,
          email: data.email || '',
          color: data.color,
          joinedAt: data.joinedAt?.toDate() || new Date(),
          isCurrentUser: data.isCurrentUser || false
        };
        
        log.debug('Family member found', { userId, displayName: member.displayName });
        return member;
      } else {
        log.warn('Family member not found', { userId, familyId });
        return null;
      }
      
    } catch (error) {
      log.error('Error getting family member', error);
      return null;
    }
  },

  // デバイス固有の情報を取得（プラットフォーム情報など）
  getDeviceInfo(): { platform: string; model: string } {
    return {
      platform: Platform.OS || 'unknown', // 'ios' or 'android'
      model: (Platform.constants as any)?.Model || `${Platform.OS}_device`
    };
  }
};

// 認証フローの状態管理
export type AuthFlowState = 
  | 'checking'        // 初期化・判定中
  | 'first_time'      // 初回起動（家族作成必要）
  | 'user_selection'  // ユーザー選択必要
  | 'auto_login'      // 自動ログイン可能
  | 'error';          // エラー状態

export interface AuthFlowResult {
  state: AuthFlowState;
  deviceId?: string;
  familyId?: string;
  lastUserId?: string;
  error?: string;
}

// 認証フローの判定ロジック
export const determineAuthFlow = (
  sessionLoading: boolean,
  session: { 
    deviceId: string; 
    familyId: string | null; 
    lastUserId: string | null; 
    isFirstTime: boolean; 
    userSelectionCount: number; 
  } | null,
  sessionError: string | null
): AuthFlowResult => {
  
  // ローディング中
  if (sessionLoading) {
    return { state: 'checking' };
  }
  
  // エラー状態
  if (sessionError || !session) {
    return { 
      state: 'error', 
      error: sessionError || 'セッション情報の取得に失敗しました' 
    };
  }
  
  // 初回起動判定
  if (session.isFirstTime || !session.familyId) {
    return { 
      state: 'first_time',
      deviceId: session.deviceId
    };
  }
  
  // 自動ログイン判定（3回目以降 & 前回ユーザーあり）
  if (session.userSelectionCount >= 2 && session.lastUserId) {
    return {
      state: 'auto_login',
      deviceId: session.deviceId,
      familyId: session.familyId,
      lastUserId: session.lastUserId
    };
  }
  
  // ユーザー選択が必要
  return {
    state: 'user_selection',
    deviceId: session.deviceId,
    familyId: session.familyId
  };
}; 