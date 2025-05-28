import { collection, doc, getDocs, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { createFamily, db } from '../firebaseConfig';

export interface Baby {
  id: string;
  name: string;
  birthday: Date;
}

export interface FamilyMember {
  id: string;
  role: 'dad' | 'mom' | 'other';
  email: string;
  joinedAt: Date;
}

export interface Family {
  id: string;
  createdAt: Date;
  creatorId: string;
  babies: Baby[];
  members: FamilyMember[];
}

export function useFamily(familyId?: string) {
  const [family, setFamily] = useState<Family | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!familyId) {
      setLoading(false);
      return;
    }

    const familyRef = doc(db, 'families', familyId);
    const babiesRef = collection(familyRef, 'babies');
    const membersRef = collection(familyRef, 'members');

    const unsubscribe = onSnapshot(
      familyRef,
      async (familyDoc) => {
        if (!familyDoc.exists()) {
          setError(new Error('Family not found'));
          setLoading(false);
          return;
        }

        try {
          // Get babies
          const babiesSnapshot = await getDocs(babiesRef);
          const babies = babiesSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            birthday: doc.data().birthday.toDate(),
          })) as Baby[];

          // Get members
          const membersSnapshot = await getDocs(membersRef);
          const members = membersSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            joinedAt: doc.data().joinedAt.toDate(),
          })) as FamilyMember[];

          setFamily({
            id: familyDoc.id,
            ...familyDoc.data(),
            createdAt: familyDoc.data().createdAt.toDate(),
            babies,
            members,
          } as Family);
          setLoading(false);
        } catch (err) {
          console.error('Error fetching family data:', err);
          setError(err instanceof Error ? err : new Error('Failed to fetch family data'));
          setLoading(false);
        }
      },
      (err) => {
        console.error('Family snapshot error:', err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [familyId]);

  const createNewFamily = async (babyName: string, birthday: Date) => {
    try {
      const newFamilyId = await createFamily(babyName, birthday);
      return newFamilyId;
    } catch (err) {
      console.error('Error creating family:', err);
      throw err;
    }
  };

  return {
    family,
    loading,
    error,
    createNewFamily,
  };
} 