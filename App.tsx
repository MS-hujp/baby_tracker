import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { AuthProvider } from './src/contexts/AuthContext';
import { TimelineProvider } from './src/contexts/TimelineContext';
import AppNavigator from './src/navigation/AppNavigator';

const App = () => {
  return (
    <NavigationContainer>
      <AuthProvider>
        <TimelineProvider>
          <AppNavigator />
        </TimelineProvider>
      </AuthProvider>
    </NavigationContainer>
  );
};

export default App; 