import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { AuthProvider } from '../src/contexts/AuthContext';
import { BabyProvider } from '../src/contexts/BabyContext';
import { TimelineProvider } from '../src/contexts/TimelineContext';
import { initializeAnalytics } from '../src/firebaseConfig';

export default function RootLayout() {
  useEffect(() => {
    // Initialize Firebase Analytics if supported
    const init = async () => {
      await initializeAnalytics();
    };
    init();
  }, []);

  return (
    <AuthProvider>
      <BabyProvider>
        <TimelineProvider>
          <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="home" options={{ headerShown: false }} />
            <Stack.Screen name="feeding" options={{ headerShown: false }} />
            <Stack.Screen name="diaper" options={{ headerShown: false }} />
            <Stack.Screen name="sleep" options={{ headerShown: false }} />
            <Stack.Screen name="wakeup" options={{ headerShown: false }} />
            <Stack.Screen name="measurement" options={{ headerShown: false }} />
            <Stack.Screen name="statistics" options={{ headerShown: false }} />
            <Stack.Screen name="timeline" options={{ headerShown: false }} />
            <Stack.Screen name="settings" options={{ headerShown: false }} />
          </Stack>
        </TimelineProvider>
      </BabyProvider>
    </AuthProvider>
  );
} 