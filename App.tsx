import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from './src/navigation/AppNavigator';
import { AuthProvider } from './src/contexts/AuthContext';

/**
 * No Fat Community — мобильное приложение для мотивации и соревнований в похудении
 * React Native (Expo) + TypeScript + React Navigation 6
 */
export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <StatusBar style="dark" translucent />
          <AppNavigator />
        </GestureHandlerRootView>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
