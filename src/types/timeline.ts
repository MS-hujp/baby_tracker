import { User } from '../contexts/AuthContext';

export type TimelineRecordType = "feeding" | "sleep" | "wakeup" | "diaper" | "measurement";

export interface TimelineRecord {
  id: string;
  type: TimelineRecordType;
  timestamp: Date;
  user: User;
  details: {
    feeding?: {
      type: "breast" | "formula";
      amount?: number;
    };
    sleep?: {
      startTime: Date;
    };
    wakeup?: {
      time: Date;
    };
    diaper?: {
      pee: boolean;
      poop: boolean;
    };
    measurement?: {
      height?: number;
      weight?: number;
      temperature?: number;
    };
  };
} 