import {
    addDoc,
    collection,
    doc,
    getDocs,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
    setDoc,
    Timestamp,
    updateDoc,
    where
} from 'firebase/firestore';
import { db } from '../firebaseConfig';
import {
    Baby,
    BabyInfo,
    DiaperRecord,
    FamilyMember,
    FamilyWithData,
    FeedingRecord,
    MeasurementRecord,
    Participant,
    Record,
    SleepRecord
} from '../types/family';

// Helper function to convert Firestore timestamp to Date
const convertTimestamp = (timestamp: any): Date => {
  if (timestamp instanceof Timestamp) {
    return timestamp.toDate();
  }
  if (timestamp instanceof Date) {
    return timestamp;
  }
  return new Date(timestamp);
};

// Family Operations
export const familyOperations = {
  // Create a new family with initial baby
  async createFamily(babyName: string, birthday: Date): Promise<string> {
    // Create family document
    const familyRef = doc(collection(db, 'families'));
    await setDoc(familyRef, {
      createdAt: serverTimestamp(),
      creatorId: 'default-user', // Keep default for now as requested
    });

    // Create baby document
    const babyRef = doc(collection(familyRef, 'babies'));
    await setDoc(babyRef, {
      name: babyName,
      birthday,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    // Create default member
    await setDoc(doc(collection(familyRef, 'members'), 'default-user'), {
      role: 'dad',
      email: '',
      joinedAt: serverTimestamp(),
    });

    return familyRef.id;
  },

  // Get family with babies and members
  async getFamily(familyId: string): Promise<FamilyWithData | null> {
    const familyRef = doc(db, 'families', familyId);
    const babiesRef = collection(familyRef, 'babies');
    const membersRef = collection(familyRef, 'members');

    try {
      const [familyDoc, babiesSnapshot, membersSnapshot] = await Promise.all([
        getDocs(query(collection(db, 'families'), where('__name__', '==', familyId))),
        getDocs(babiesRef),
        getDocs(membersRef)
      ]);

      if (familyDoc.empty) return null;

      const familyData = familyDoc.docs[0].data();
      const babies = babiesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        birthday: convertTimestamp(doc.data().birthday),
        createdAt: convertTimestamp(doc.data().createdAt),
        updatedAt: convertTimestamp(doc.data().updatedAt),
      })) as Baby[];

      const members = membersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        joinedAt: convertTimestamp(doc.data().joinedAt),
      })) as FamilyMember[];

      return {
        id: familyDoc.docs[0].id,
        createdAt: convertTimestamp(familyData.createdAt),
        creatorId: familyData.creatorId || 'default-user',
        babies,
        members,
      };
    } catch (error) {
      console.error('Error getting family:', error);
      return null;
    }
  },

  // Subscribe to family changes
  subscribeToFamily(familyId: string, callback: (family: FamilyWithData | null, error?: Error) => void) {
    const familyRef = doc(db, 'families', familyId);
    const babiesRef = collection(familyRef, 'babies');
    const membersRef = collection(familyRef, 'members');

    return onSnapshot(
      familyRef,
      async (familyDoc) => {
        if (!familyDoc.exists()) {
          callback(null, new Error('Family not found'));
          return;
        }

        try {
          const [babiesSnapshot, membersSnapshot] = await Promise.all([
            getDocs(babiesRef),
            getDocs(membersRef)
          ]);

          const babies = babiesSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            birthday: convertTimestamp(doc.data().birthday),
            createdAt: convertTimestamp(doc.data().createdAt),
            updatedAt: convertTimestamp(doc.data().updatedAt),
          })) as Baby[];

          const members = membersSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            joinedAt: convertTimestamp(doc.data().joinedAt),
          })) as FamilyMember[];

          const family: FamilyWithData = {
            id: familyDoc.id,
            createdAt: convertTimestamp(familyDoc.data()!.createdAt),
            creatorId: familyDoc.data()!.creatorId || 'default-user',
            babies,
            members,
          };

          callback(family);
        } catch (error) {
          callback(null, error instanceof Error ? error : new Error('Failed to fetch family data'));
        }
      },
      (error) => {
        callback(null, error);
      }
    );
  }
};

// Baby Operations
export const babyOperations = {
  // Update baby information
  async updateBaby(familyId: string, babyId: string, data: Partial<Baby>): Promise<void> {
    const babyRef = doc(db, 'families', familyId, 'babies', babyId);
    await updateDoc(babyRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
  },

  // Convert Baby to BabyInfo for UI compatibility
  convertToBabyInfo(baby: Baby, participants: Participant[] = []): BabyInfo {
    const ageInDays = Math.floor(
      (new Date().getTime() - baby.birthday.getTime()) / (1000 * 60 * 60 * 24)
    );

    return {
      id: baby.id,
      name: baby.name,
      birthdate: baby.birthday.toISOString().split('T')[0], // YYYY-MM-DD
      weight: baby.currentWeight,
      height: baby.currentHeight,
      ageInDays,
      participants,
    };
  }
};

// Record Operations
export const recordOperations = {
  // Add feeding record
  async addFeedingRecord(familyId: string, babyId: string, data: Omit<FeedingRecord, 'id' | 'babyId' | 'createdAt' | 'updatedAt' | 'createdBy'>): Promise<string> {
    const recordsRef = collection(db, 'families', familyId, 'babies', babyId, 'records');
    const docRef = await addDoc(recordsRef, {
      ...data,
      type: 'feeding',
      babyId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      createdBy: 'default-user',
    });
    return docRef.id;
  },

  // Add diaper record
  async addDiaperRecord(familyId: string, babyId: string, data: Omit<DiaperRecord, 'id' | 'babyId' | 'createdAt' | 'updatedAt' | 'createdBy'>): Promise<string> {
    const recordsRef = collection(db, 'families', familyId, 'babies', babyId, 'records');
    const docRef = await addDoc(recordsRef, {
      ...data,
      type: 'diaper',
      babyId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      createdBy: 'default-user',
    });
    return docRef.id;
  },

  // Add sleep record
  async addSleepRecord(familyId: string, babyId: string, data: Omit<SleepRecord, 'id' | 'babyId' | 'createdAt' | 'updatedAt' | 'createdBy'>): Promise<string> {
    const recordsRef = collection(db, 'families', familyId, 'babies', babyId, 'records');
    const docRef = await addDoc(recordsRef, {
      ...data,
      type: 'sleep',
      babyId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      createdBy: 'default-user',
    });
    return docRef.id;
  },

  // Update sleep record (for wake up)
  async updateSleepRecord(familyId: string, babyId: string, recordId: string, data: Partial<SleepRecord>): Promise<void> {
    const recordRef = doc(db, 'families', familyId, 'babies', babyId, 'records', recordId);
    await updateDoc(recordRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
  },

  // Add measurement record
  async addMeasurementRecord(familyId: string, babyId: string, data: Omit<MeasurementRecord, 'id' | 'babyId' | 'createdAt' | 'updatedAt' | 'createdBy'>): Promise<string> {
    const recordsRef = collection(db, 'families', familyId, 'babies', babyId, 'records');
    const docRef = await addDoc(recordsRef, {
      ...data,
      type: 'measurement',
      babyId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      createdBy: 'default-user',
    });
    return docRef.id;
  },

  // Get records for a baby
  async getRecords(familyId: string, babyId: string, recordType?: string, limit: number = 50): Promise<Record[]> {
    const recordsRef = collection(db, 'families', familyId, 'babies', babyId, 'records');
    let q = query(recordsRef, orderBy('createdAt', 'desc'));

    if (recordType) {
      q = query(recordsRef, where('type', '==', recordType), orderBy('createdAt', 'desc'));
    }

    const snapshot = await getDocs(q);
    return snapshot.docs.slice(0, limit).map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: convertTimestamp(data.createdAt),
        updatedAt: convertTimestamp(data.updatedAt),
        timestamp: data.timestamp ? convertTimestamp(data.timestamp) : undefined,
        startTime: data.startTime ? convertTimestamp(data.startTime) : undefined,
        endTime: data.endTime ? convertTimestamp(data.endTime) : undefined,
      } as any;
    }) as Record[];
  },

  // Subscribe to records
  subscribeToRecords(familyId: string, babyId: string, callback: (records: Record[]) => void, recordType?: string) {
    const recordsRef = collection(db, 'families', familyId, 'babies', babyId, 'records');
    let q = query(recordsRef, orderBy('createdAt', 'desc'));

    if (recordType) {
      q = query(recordsRef, where('type', '==', recordType), orderBy('createdAt', 'desc'));
    }

    return onSnapshot(q, (snapshot) => {
      const records = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: convertTimestamp(data.createdAt),
          updatedAt: convertTimestamp(data.updatedAt),
          timestamp: data.timestamp ? convertTimestamp(data.timestamp) : undefined,
          startTime: data.startTime ? convertTimestamp(data.startTime) : undefined,
          endTime: data.endTime ? convertTimestamp(data.endTime) : undefined,
        } as any;
      }) as Record[];
      callback(records);
    });
  }
}; 