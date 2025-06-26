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

const Stack = createNativeStackNavigator();

const FAMILY_ID_KEY = 'CURRENT_FAMILY_ID';

// Main App Content (inside BabyProvider)
const AppContent = () => {
  const { familyId, setFamilyId } = useBaby();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadFamilyId = async () => {
      try {
        const savedFamilyId = await AsyncStorage.getItem(FAMILY_ID_KEY);
        if (savedFamilyId) {
          setFamilyId(savedFamilyId);
        }
      } catch (error) {
        console.error('Error loading family ID:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFamilyId();
  }, [setFamilyId]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!familyId) {
    return <CreateFamilyScreen />;
  }

  return <AppNavigator />;
};

const App = () => {
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