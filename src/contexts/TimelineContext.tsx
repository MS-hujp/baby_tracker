import React, { createContext, ReactNode, useContext, useState } from 'react';
import { TimelineRecord } from '../types/timeline';

type TimelineContextType = {
  records: TimelineRecord[];
  addRecord: (record: Omit<TimelineRecord, 'id'>) => void;
};

const TimelineContext = createContext<TimelineContextType | undefined>(undefined);

export const TimelineProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [records, setRecords] = useState<TimelineRecord[]>([]);

  const addRecord = (record: Omit<TimelineRecord, 'id'>) => {
    const newRecord: TimelineRecord = {
      ...record,
      id: Date.now().toString(), // 簡易的なID生成
    };
    setRecords(prev => [newRecord, ...prev]); // 新しい記録を先頭に追加
  };

  return (
    <TimelineContext.Provider value={{ records, addRecord }}>
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