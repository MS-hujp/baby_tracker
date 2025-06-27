// Common Types for Baby Tracker App

// Event handler types
export interface TimeChangeEvent {
  type: 'set' | 'dismissed' | 'neutralButtonPressed';
  nativeEvent: {
    timestamp?: number;
  };
}

// Chart and UI types
export interface ChartOption {
  [key: string]: any;
}

export interface ChartParams {
  name: string;
  value: number | number[];
  seriesName?: string;
  [key: string]: any;
}

export interface ChartTooltipResult {
  content: string;
  [key: string]: any;
}

// ECharts specific types
export interface EChartsParams {
  value: number[];
  name: string;
  seriesName?: string;
  [key: string]: any;
}

export type EChartsTooltipFormatter = (params: EChartsParams) => string;

// Record types for UI
export interface LatestRecord {
  id: string;
  type: string;
  timestamp: Date;
  user: {
    name: string;
    [key: string]: any;
  };
  [key: string]: any;
}

export interface LatestRecordsByCategory {
  [category: string]: LatestRecord;
}

// Form data types
export interface FormData {
  [key: string]: any;
}

// API response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

// Device and session types
export interface DeviceInfo {
  id: string;
  platform: 'ios' | 'android' | 'web' | 'unknown';
  [key: string]: any;
}

// User selection types
export interface UserSelection {
  id: string;
  displayName: string;
  [key: string]: any;
}

// Measurement update types
export interface MeasurementUpdateData {
  timestamp?: Date;
  height?: number;
  weight?: number;
  temperature?: number;
  [key: string]: any;
} 