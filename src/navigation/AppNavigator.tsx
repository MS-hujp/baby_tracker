import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import DiaperScreen from '../screens/DiaperScreen';
import FeedingScreen from '../screens/FeedingScreen';
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import MeasurementScreen from '../screens/MeasurementScreen';
import SettingsScreen from '../screens/SettingsScreen';
import SleepScreen from '../screens/SleepScreen';
import StatisticsScreen from '../screens/StatisticsScreen';
import TimelineScreen from '../screens/TimelineScreen';
import WakeupScreen from '../screens/WakeupScreen';

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Feeding: undefined;
  Diaper: undefined;
  Sleep: undefined;
  Wakeup: undefined;
  Measurement: undefined;
  Statistics: undefined;
  Timeline: undefined;
  Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const { currentUser } = useAuth();

  return (
    <Stack.Navigator
      initialRouteName={currentUser ? "Home" : "Login"}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen 
        name="Login" 
        component={LoginScreen} 
        options={{ 
          gestureEnabled: false 
        }}
      />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Feeding" component={FeedingScreen} />
      <Stack.Screen name="Diaper" component={DiaperScreen} />
      <Stack.Screen name="Sleep" component={SleepScreen} />
      <Stack.Screen name="Wakeup" component={WakeupScreen} />
      <Stack.Screen name="Measurement" component={MeasurementScreen} />
      <Stack.Screen name="Statistics" component={StatisticsScreen} />
      <Stack.Screen name="Timeline" component={TimelineScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
