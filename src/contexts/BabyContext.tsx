import React, { createContext, ReactNode, useContext } from 'react';

export type Participant = {
  name: string;
  color: string;
};

export type BabyInfo = {
  name: string;
  ageInDays: number;
  participants: Participant[];
};

type BabyContextType = {
  babyInfo: BabyInfo;
};

const defaultBabyInfo: BabyInfo = {
  name: "まきちゃん",
  ageInDays: 30,
  participants: [
    { name: "ゆか", color: "#FFF" },
    { name: "けん", color: "blue" },
  ],
};

const BabyContext = createContext<BabyContextType | undefined>(undefined);

export const BabyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <BabyContext.Provider value={{ babyInfo: defaultBabyInfo }}>
      {children}
    </BabyContext.Provider>
  );
};

export const useBaby = () => {
  const context = useContext(BabyContext);
  if (context === undefined) {
    throw new Error('useBaby must be used within a BabyProvider');
  }
  return context;
}; 