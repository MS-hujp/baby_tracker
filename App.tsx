import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { AuthProvider } from './src/contexts/AuthContext';
import { BabyProvider, useBaby } from './src/contexts/BabyContext';
import { TimelineProvider } from './src/contexts/TimelineContext';
import AppNavigator from './src/navigation/AppNavigator';
import CreateFamilyScreen from './src/screens/CreateFamily';
import { testFirebaseConnection } from './src/utils/firebase-test';

const Stack = createNativeStackNavigator();

const FAMILY_ID_KEY = 'CURRENT_FAMILY_ID';

// Main App Content (inside BabyProvider)
const AppContent = () => {
  const { setFamilyId, familyId } = useBaby();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeFamilyId = async () => {
      try {
        // 保存されている家族IDを取得
        const savedFamilyId = await AsyncStorage.getItem(FAMILY_ID_KEY);
        console.log('Saved family ID:', savedFamilyId);
        
        if (savedFamilyId) {
          setFamilyId(savedFamilyId);
        }
        
        setIsInitialized(true);
      } catch (error) {
        console.error('Error loading family ID:', error);
        setIsInitialized(true);
      }
    };

    initializeFamilyId();
  }, [setFamilyId]);

  // 家族IDが保存された時にAsyncStorageに保存
  useEffect(() => {
    const saveFamilyId = async () => {
      if (familyId) {
        try {
          await AsyncStorage.setItem(FAMILY_ID_KEY, familyId);
          console.log('Family ID saved:', familyId);
        } catch (error) {
          console.error('Error saving family ID:', error);
        }
      }
    };

    saveFamilyId();
  }, [familyId]);

  if (!isInitialized) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>アプリを初期化中...</Text>
      </View>
    );
  }

  return (
    <Stack.Navigator>
      {familyId ? (
        // 家族IDがある場合はメインアプリを表示
        <Stack.Screen
          name="Main"
          component={AppNavigator}
          options={{ headerShown: false }}
        />
      ) : (
        // 家族IDがない場合は家族作成画面を表示
        <Stack.Screen
          name="CreateFamily"
          component={CreateFamilyScreen}
          options={{
            headerShown: true,
            title: '新しい家族を作成',
            headerBackVisible: false, // 戻るボタンを非表示
          }}
        />
      )}
      <Stack.Screen
        name="CreateFamilyModal"
        component={CreateFamilyScreen}
        options={{
          headerShown: true,
          title: '新しい家族を作成',
          presentation: 'modal'
        }}
      />
    </Stack.Navigator>
  );
};

const App = () => {
  const [isReady, setIsReady] = useState(false);
  const [firebaseConnected, setFirebaseConnected] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Firebase接続テスト
        const isConnected = await testFirebaseConnection();
        setFirebaseConnected(isConnected);
        setIsReady(true);
      } catch (error) {
        console.error('Failed to initialize app:', error);
        setIsReady(true);
      }
    };

    initializeApp();
  }, []);

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!firebaseConnected) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Failed to connect to Firebase. Please check your configuration.</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <AuthProvider>
        <BabyProvider>
          <TimelineProvider>
            <AppContent />
          </TimelineProvider>
        </BabyProvider>
      </AuthProvider>
    </NavigationContainer>
  );
};

export default App; 