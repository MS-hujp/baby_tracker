import { NavigationContainer } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { AuthProvider } from './src/contexts/AuthContext';
import { BabyProvider } from './src/contexts/BabyContext';
import { TimelineProvider } from './src/contexts/TimelineContext';
import AppNavigator from './src/navigation/AppNavigator';

const App = () => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Dynamically import Firebase to ensure it's fully initialized
    const loadFirebase = async () => {
      try {
        await import('./src/firebase');
        setIsReady(true);
      } catch (error) {
        console.error('Failed to initialize Firebase:', error);
      }
    };

    loadFirebase();
  }, []);

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <AuthProvider>
        <BabyProvider>
          <TimelineProvider>
            <AppNavigator />
          </TimelineProvider>
        </BabyProvider>
      </AuthProvider>
    </NavigationContainer>
  );
};

export default App; 