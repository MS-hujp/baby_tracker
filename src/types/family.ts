// Family and Baby Types
export interface Family {
  id: string;
  createdAt: Date;
  creatorId: string;
}

// Family with populated babies and members data
export interface FamilyWithData extends Family {
  babies: Baby[];
  members: FamilyMember[];
}

export interface Baby {
  id: string;
  name: string;
  birthday: Date;
  currentWeight?: number;
  currentHeight?: number;
  createdAt: Date;
  updatedAt: Date;
}

// 【重要】Firebase Authentication は絶対に使用禁止
// バグが発生することが判明しているため、未来永劫導入しない
// 認証なしの家族ベースシステムで家族メンバー管理を行う
export interface FamilyMember {
  id: string;
  displayName: string; // 実際の名前（「ゆか」「けん」など）
  role: 'dad' | 'mom' | 'other';
  email: string; // 将来の連絡用（現在は空文字でOK）
  color: string; // UI表示用カラー
  joinedAt: Date;
  isCurrentUser: boolean; // 現在のユーザーかどうかの識別
}

// Record Types (individual types maintained)
export interface BaseRecord {
  id: string;
  babyId: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export interface FeedingRecord extends BaseRecord {
  type: 'feeding';
  timestamp: Date;
  method: 'breast' | 'bottle' | 'mixed';
  amount?: number; // ml for bottle feeding
  duration?: number; // minutes for breast feeding
  leftBreast?: number; // minutes
  rightBreast?: number; // minutes
  notes?: string;
}

export interface DiaperRecord extends BaseRecord {
  type: 'diaper';
  timestamp: Date;
  wetness: boolean;      // おしっこの有無
  bowelMovement: boolean; // うんちの有無
  notes?: string;        // メモ
}

export interface SleepRecord extends BaseRecord {
  type: 'sleep';
  startTime: Date;
  endTime?: Date; // null if still sleeping
  duration?: number; // minutes, calculated when endTime is set
  notes?: string;
}

export interface MeasurementRecord extends BaseRecord {
  type: 'measurement';
  timestamp: Date;
  measurementType: 'weight' | 'height' | 'temperature';
  value: number;
  unit: string; // kg, cm, °C, etc.
  notes?: string;
}

export type Record = FeedingRecord | DiaperRecord | SleepRecord | MeasurementRecord;

// Participant type for UI compatibility
export interface Participant {
  name: string; // 名前
  color: string; // 色
  uid?: string; // ユーザーID
}

// Extended Baby Info for UI compatibility with existing BabyContext
export interface BabyInfo extends Omit<Baby, 'birthday' | 'createdAt' | 'updatedAt'> {
  birthdate?: string; // formatted date string for UI
  weight?: number; // 体重
  height?: number; // 身長
  ageInDays: number; // 月齢
  participants: Participant[]; // 育児に参加している人
} 