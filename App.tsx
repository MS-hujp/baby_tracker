import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { AuthProvider } from './src/contexts/AuthContext';
import { BabyProvider } from './src/contexts/BabyContext';
import { TimelineProvider } from './src/contexts/TimelineContext';
import AppNavigator from './src/navigation/AppNavigator';
import CreateFamilyScreen from './src/screens/CreateFamily';
import { testFirebaseConnection } from './src/utils/firebase-test';

const Stack = createNativeStackNavigator();

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
            <Stack.Navigator>
              <Stack.Screen
                name="Main"
                component={AppNavigator}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="CreateFamily"
                component={CreateFamilyScreen}
                options={{
                  headerShown: true,
                  title: '新しい家族を作成',
                  presentation: 'modal'
                }}
              />
            </Stack.Navigator>
          </TimelineProvider>
        </BabyProvider>
      </AuthProvider>
    </NavigationContainer>
  );
};

export default App; 