import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AppNavigator } from './src/navigation/AppNavigator';

/**
 * No Fat Community — мобильное приложение для мотивации и соревнований в похудении
 * React Native (Expo) + TypeScript + React Navigation 6
 */
export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="dark" translucent />
      <AppNavigator />
    </GestureHandlerRootView>
  );
}

