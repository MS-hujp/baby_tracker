import AsyncStorage from '@react-native-async-storage/async-storage';

// 家族ID競合解決とデータ統一管理システム
// 無限ループの原因である家族ID競合を根本的に解決

const STORAGE_KEYS = {
  FAMILY_ID: '@baby_tracker/family_id',
} as const;

export interface FamilyIdResolution {
  resolvedFamilyId: string;
  wasConflictResolved: boolean;
  conflictSource?: 'device_session' | 'baby_context' | 'storage';
}

export class FamilyIdResolver {
  private static instance: FamilyIdResolver;
  private currentFamilyId: string | null = null;
  private isUpdating = false;
  
  static getInstance(): FamilyIdResolver {
    if (!FamilyIdResolver.instance) {
      FamilyIdResolver.instance = new FamilyIdResolver();
    }
    return FamilyIdResolver.instance;
  }

  /**
   * 家族IDの競合を解決し、統一されたIDを返す
   * 優先順位: 最新のStorage > DeviceSession > BabyContext
   */
  async resolveFamilyId(
    deviceSessionFamilyId?: string | null,
    babyContextFamilyId?: string | null
  ): Promise<FamilyIdResolution> {
    
    // 更新中の場合は現在のIDを返す
    if (this.isUpdating && this.currentFamilyId) {
      return {
        resolvedFamilyId: this.currentFamilyId,
        wasConflictResolved: false
      };
    }

    try {
      // Step1: AsyncStorageから最新の家族IDを取得
      const storageFamilyId = await AsyncStorage.getItem(STORAGE_KEYS.FAMILY_ID);
      
      const candidates = [
        { id: storageFamilyId, source: 'storage' as const },
        { id: deviceSessionFamilyId, source: 'device_session' as const },
        { id: babyContextFamilyId, source: 'baby_context' as const }
      ].filter(candidate => candidate.id);

      if (candidates.length === 0) {
        throw new Error('No family ID candidates found');
      }

      // Step2: 競合がない場合
      if (candidates.length === 1) {
        const resolved = candidates[0].id!;
        this.currentFamilyId = resolved;
        console.log('📋 Family ID resolved (no conflict):', resolved);
        return {
          resolvedFamilyId: resolved,
          wasConflictResolved: false
        };
      }

      // Step3: 競合がある場合は優先順位で解決
      const uniqueIds = [...new Set(candidates.map(c => c.id))];
      
      if (uniqueIds.length === 1) {
        // 同じIDが複数ソースにある場合（正常）
        const resolved = uniqueIds[0]!;
        this.currentFamilyId = resolved;
        console.log('📋 Family ID resolved (same across sources):', resolved);
        return {
          resolvedFamilyId: resolved,
          wasConflictResolved: false
        };
      }

      // Step4: 真の競合がある場合 - 最新のStorageを優先
      const resolved = storageFamilyId || deviceSessionFamilyId || babyContextFamilyId!;
      const conflictSource = storageFamilyId ? 'storage' : 
                           deviceSessionFamilyId ? 'device_session' : 'baby_context';
      
      console.warn('⚠️ Family ID conflict detected, resolving to:', resolved);
      console.warn('   Candidates:', candidates);
      
      this.currentFamilyId = resolved;
      
      // Step5: 競合解決のためにStorageを更新
      await this.updateStorage(resolved);
      
      return {
        resolvedFamilyId: resolved,
        wasConflictResolved: true,
        conflictSource
      };
      
    } catch (error) {
      console.error('❌ Failed to resolve family ID:', error);
      throw error;
    }
  }

  /**
   * 家族IDを安全に更新（重複更新防止付き）
   */
  async updateFamilyId(newFamilyId: string): Promise<boolean> {
    // 既に同じIDの場合はスキップ
    if (this.currentFamilyId === newFamilyId) {
      console.log('⚠️ Family ID already set to:', newFamilyId);
      return false;
    }

    // 更新中フラグで重複更新を防ぐ
    if (this.isUpdating) {
      console.log('⚠️ Family ID update already in progress, skipping:', newFamilyId);
      return false;
    }

    try {
      this.isUpdating = true;
      console.log('📝 Updating family ID from', this.currentFamilyId, 'to', newFamilyId);
      
      await this.updateStorage(newFamilyId);
      this.currentFamilyId = newFamilyId;
      
      return true;
    } catch (error) {
      console.error('❌ Failed to update family ID:', error);
      throw error;
    } finally {
      this.isUpdating = false;
    }
  }

  /**
   * AsyncStorageを更新
   */
  private async updateStorage(familyId: string): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.FAMILY_ID, familyId);
    console.log('💾 Family ID saved to storage:', familyId);
  }

  /**
   * 現在の家族IDを取得
   */
  getCurrentFamilyId(): string | null {
    return this.currentFamilyId;
  }

  /**
   * 更新中かどうかを確認
   */
  isUpdatingFamilyId(): boolean {
    return this.isUpdating;
  }

  /**
   * リセット（デバッグ用）
   */
  reset(): void {
    this.currentFamilyId = null;
    this.isUpdating = false;
  }
}

// シングルトンインスタンスをエクスポート
export const familyIdResolver = FamilyIdResolver.getInstance(); 