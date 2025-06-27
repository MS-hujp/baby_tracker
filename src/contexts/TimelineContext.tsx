import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { useRecords } from '../hooks/useRecords';
import { TimelineRecord, TimelineRecordType } from '../types/timeline';
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
    getRecords,
    addWakeupRecord
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
            type: record.type as TimelineRecordType,
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
                    amount: record.amount,
                    leftDuration: record.leftBreast,
                    rightDuration: record.rightBreast
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
            case 'wakeup':
              return {
                ...baseRecord,
                details: {
                  wakeup: {
                    time: timestamp
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

        // 降順でソート（新しい記録が上）
        const sortedRecords = timelineRecords.sort((a, b) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );

        setRecords(sortedRecords);
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
          
          // 母乳の場合、左右の授乳時間を追加
          if (record.details?.feeding?.type === 'breast') {
            feedingData.leftBreast = record.details.feeding.leftDuration || 0;
            feedingData.rightBreast = record.details.feeding.rightDuration || 0;
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
          // wakeupは独立した記録タイプとして保存
          recordId = await addWakeupRecord({
            timestamp: record.timestamp,
            notes: ''
          });
          break;

        case 'measurement':
          // 測定記録を個別に追加（身長、体重、体温を別々の記録として保存）
          const measurementDetails = record.details?.measurement;
          const recordIds: string[] = [];
          
          // 体重の記録
          if (measurementDetails?.weight !== undefined && measurementDetails.weight > 0) {
            const weightRecordId = await addMeasurementRecord({
              timestamp: record.timestamp,
              measurementType: 'weight',
              value: measurementDetails.weight,
              unit: 'g',
              notes: ''
            });
            recordIds.push(weightRecordId);
          }
          
          // 身長の記録
          if (measurementDetails?.height !== undefined && measurementDetails.height > 0) {
            const heightRecordId = await addMeasurementRecord({
              timestamp: record.timestamp,
              measurementType: 'height',
              value: measurementDetails.height,
              unit: 'cm',
              notes: ''
            });
            recordIds.push(heightRecordId);
          }
          
          // 体温の記録
          if (measurementDetails?.temperature !== undefined && measurementDetails.temperature > 0) {
            const temperatureRecordId = await addMeasurementRecord({
              timestamp: record.timestamp,
              measurementType: 'temperature',
              value: measurementDetails.temperature,
              unit: '°C',
              notes: ''
            });
            recordIds.push(temperatureRecordId);
          }
          
          // 最初の記録IDを返す（複数の記録が作成された場合）
          recordId = recordIds[0] || '';
          break;

        default:
          throw new Error(`Unsupported record type: ${record.type}`);
      }

      // 新しい記録をローカル状態に追加（user情報を確実に設定）
      const newRecord: TimelineRecord = {
        ...record,
        id: recordId,
        user: {
          id: record.user?.id || 'default-user',
          name: record.user?.name || 'ユーザー',
          color: record.user?.color || '#FF6B6B'
        }
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