import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import DiaperScreen from './src/screens/DiaperScreen';
import FeedingScreen from './src/screens/FeedingScreen';
import HomeScreen from './src/screens/HomeScreen';
import MeasurementScreen from './src/screens/MeasurementScreen';
import SleepScreen from './src/screens/SleepScreen';
import WakeupScreen from './src/screens/WakeupScreen';

export type RootStackParamList = {
  Home: undefined;
  Feeding: undefined;
  Diaper: undefined;
  Sleep: undefined;
  Wakeup: undefined;
  Measurement: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Feeding" component={FeedingScreen} />
        <Stack.Screen name="Diaper" component={DiaperScreen} />
        <Stack.Screen name="Sleep" component={SleepScreen} />
        <Stack.Screen name="Wakeup" component={WakeupScreen} />
        <Stack.Screen name="Measurement" component={MeasurementScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App; 