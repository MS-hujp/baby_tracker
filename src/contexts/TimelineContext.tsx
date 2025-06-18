import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { useRecords } from '../hooks/useRecords';
import { TimelineRecord } from '../types/timeline';
import { useBaby } from './BabyContext';

type TimelineContextType = {
  records: TimelineRecord[];
  addRecord: (record: Omit<TimelineRecord, 'id'>) => Promise<void>;
  loading: boolean;
  error: string | null;
};

const TimelineContext = createContext<TimelineContextType | undefined>(undefined);

export const TimelineProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [records, setRecords] = useState<TimelineRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { familyId, babyInfo } = useBaby();
  const { 
    addFeedingRecord, 
    addDiaperRecord, 
    addSleepRecord, 
    addMeasurementRecord,
    getRecords 
  } = useRecords();

  // Firebaseから記録を取得
  useEffect(() => {
    if (!familyId || !babyInfo?.id) return;

    const loadRecords = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const firebaseRecords = await getRecords();
        
        // Firebaseの記録をTimelineRecord形式に変換
        const timelineRecords: TimelineRecord[] = firebaseRecords.map(record => {
          // timestampの安全な取得
          let timestamp: Date;
          if ('timestamp' in record && record.timestamp) {
            timestamp = record.timestamp;
          } else if (record.createdAt) {
            timestamp = record.createdAt;
          } else {
            timestamp = new Date(); // フォールバック
          }

          const baseRecord = {
            id: record.id,
            type: record.type as any,
            timestamp: timestamp,
            user: {
              id: record.createdBy || 'default-user',
              name: record.createdBy || 'ユーザー',
              color: '#FF6B6B'
            },
            details: {}
          };

          // 記録タイプに応じてdetailsを設定
          switch (record.type) {
            case 'feeding':
              return {
                ...baseRecord,
                details: {
                  feeding: {
                    type: record.method === 'breast' ? 'breast' : 'formula',
                    amount: record.amount
                  }
                }
              };
            case 'diaper':
              return {
                ...baseRecord,
                details: {
                  diaper: {
                    pee: record.wetness,
                    poop: record.bowelMovement
                  }
                }
              };
            case 'sleep':
              return {
                ...baseRecord,
                details: {
                  sleep: {
                    startTime: 'startTime' in record && record.startTime ? record.startTime : timestamp
                  }
                }
              };
            case 'measurement':
              return {
                ...baseRecord,
                details: {
                  measurement: {
                    height: record.measurementType === 'height' ? record.value : undefined,
                    weight: record.measurementType === 'weight' ? record.value : undefined,
                    temperature: record.measurementType === 'temperature' ? record.value : undefined
                  }
                }
              };
            default:
              return baseRecord;
          }
        });

        setRecords(timelineRecords);
      } catch (err) {
        console.error('Error loading records:', err);
        setError('記録の読み込みに失敗しました');
      } finally {
        setLoading(false);
      }
    };

    loadRecords();
  }, [familyId, babyInfo?.id, getRecords]);

  const addRecord = async (record: Omit<TimelineRecord, 'id'>) => {
    try {
      setLoading(true);
      setError(null);

      let recordId: string;

      switch (record.type) {
        case 'feeding':
          const feedingData: any = {
            timestamp: record.timestamp,
            method: record.details?.feeding?.type === 'breast' ? 'breast' : 'bottle',
            duration: 0,
            notes: ''
          };
          
          // ミルクの場合のみamountを追加
          if (record.details?.feeding?.type === 'formula' && record.details?.feeding?.amount) {
            feedingData.amount = record.details.feeding.amount;
          }
          
          recordId = await addFeedingRecord(feedingData);
          break;

        case 'diaper':
          recordId = await addDiaperRecord({
            timestamp: record.timestamp,
            wetness: record.details?.diaper?.pee || false,
            bowelMovement: record.details?.diaper?.poop || false,
            notes: ''
          });
          break;

        case 'sleep':
          recordId = await addSleepRecord({
            startTime: record.timestamp,
            notes: ''
          });
          break;

        case 'wakeup':
          // wakeupはsleep記録の更新として処理
          recordId = await addSleepRecord({
            startTime: record.timestamp,
            notes: ''
          });
          break;

        case 'measurement':
          const measurementType = record.details?.measurement?.weight ? 'weight' : 
                                record.details?.measurement?.height ? 'height' : 'temperature';
          const value = record.details?.measurement?.weight || 
                       record.details?.measurement?.height || 
                       record.details?.measurement?.temperature || 0;
          
          recordId = await addMeasurementRecord({
            timestamp: record.timestamp,
            measurementType: measurementType as any,
            value: value,
            unit: measurementType === 'weight' ? 'kg' : measurementType === 'height' ? 'cm' : '°C',
            notes: ''
          });
          break;

        default:
          throw new Error(`Unsupported record type: ${record.type}`);
      }

      // 新しい記録をローカル状態に追加
      const newRecord: TimelineRecord = {
        ...record,
        id: recordId,
      };
      
      setRecords(prev => [newRecord, ...prev]);
      
      console.log('✅ Record added successfully:', recordId);
    } catch (err) {
      console.error('❌ Error adding record:', err);
      setError('記録の追加に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <TimelineContext.Provider value={{ records, addRecord, loading, error }}>
      {children}
    </TimelineContext.Provider>
  );
};

export const useTimeline = () => {
  const context = useContext(TimelineContext);
  if (context === undefined) {
    throw new Error('useTimeline must be used within a TimelineProvider');
  }
  return context;
}; 