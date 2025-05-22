import { db } from '../firebase';

// 赤ちゃん情報の取得
export const getBabyInfo = async (babyId) => {
  const babyDoc = await db.collection('babies').doc(babyId).get();
  if (babyDoc.exists) {
    return { id: babyDoc.id, ...babyDoc.data() };
  }
  return null;
};

// 赤ちゃん情報の追加
export const addBaby = async (babyData) => {
  try {
    const docRef = await db.collection('babies').add(babyData);
    return { id: docRef.id, ...babyData };
  } catch (error) {
    console.error('Error adding baby: ', error);
    throw error;
  }
};

// 赤ちゃん情報の更新
export const updateBaby = async (babyId, babyData) => {
  try {
    await db.collection('babies').doc(babyId).update(babyData);
    return { id: babyId, ...babyData };
  } catch (error) {
    console.error('Error updating baby: ', error);
    throw error;
  }
};

// 授乳記録の追加
export const addFeeding = async (feedingData) => {
  try {
    const docRef = await db.collection('feedings').add({
      ...feedingData,
      timestamp: new Date()
    });
    return { id: docRef.id, ...feedingData, timestamp: new Date() };
  } catch (error) {
    console.error('Error adding feeding: ', error);
    throw error;
  }
};

// 授乳記録の取得
export const getFeedings = async (babyId, limit = 10) => {
  try {
    const snapshot = await db.collection('feedings')
      .where('baby_id', '==', babyId)
      .orderBy('timestamp', 'desc')
      .limit(limit)
      .get();
      
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting feedings: ', error);
    throw error;
  }
};

// おむつ記録の追加
export const addDiaper = async (diaperData) => {
  try {
    const docRef = await db.collection('diapers').add({
      ...diaperData,
      timestamp: new Date()
    });
    return { id: docRef.id, ...diaperData, timestamp: new Date() };
  } catch (error) {
    console.error('Error adding diaper: ', error);
    throw error;
  }
};

// 就寝記録の追加
export const addSleep = async (sleepData) => {
  try {
    const docRef = await db.collection('sleeps').add({
      ...sleepData,
      start_time: new Date()
    });
    return { id: docRef.id, ...sleepData, start_time: new Date() };
  } catch (error) {
    console.error('Error adding sleep: ', error);
    throw error;
  }
};

// 起床記録（就寝記録の更新）
export const updateSleepWithWakeup = async (sleepId) => {
  try {
    await db.collection('sleeps').doc(sleepId).update({
      end_time: new Date()
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating sleep with wakeup: ', error);
    throw error;
  }
};

// 測定記録の追加
export const addMeasurement = async (measurementData) => {
  try {
    const docRef = await db.collection('measurements').add({
      ...measurementData,
      timestamp: new Date()
    });
    return { id: docRef.id, ...measurementData, timestamp: new Date() };
  } catch (error) {
    console.error('Error adding measurement: ', error);
    throw error;
  }
};

// タイムライン取得（複数のコレクションを統合）
export const getTimeline = async (babyId, limit = 20) => {
  try {
    // 各コレクションからデータを取得
    const [feedings, diapers, sleeps, measurements] = await Promise.all([
      getCollection('feedings', babyId, limit),
      getCollection('diapers', babyId, limit),
      getCollection('sleeps', babyId, limit),
      getCollection('measurements', babyId, limit)
    ]);
    
    // 全てのデータを統合してタイムスタンプでソート
    const timeline = [...feedings, ...diapers, ...sleeps, ...measurements]
      .sort((a, b) => {
        const aTime = a.timestamp || a.start_time;
        const bTime = b.timestamp || b.start_time;
        return bTime - aTime; // 降順（新しい順）
      })
      .slice(0, limit);
      
    return timeline;
  } catch (error) {
    console.error('Error getting timeline: ', error);
    throw error;
  }
};

// 共通のコレクション取得関数
const getCollection = async (collectionName, babyId, limitCount) => {
  const snapshot = await db.collection(collectionName)
    .where('baby_id', '==', babyId)
    .orderBy('timestamp', 'desc')
    .limit(limitCount)
    .get();
    
  return snapshot.docs.map(doc => ({ 
    id: doc.id, 
    ...doc.data(),
    type: collectionName.slice(0, -1) // 'feedings' -> 'feeding'
  }));
}; 