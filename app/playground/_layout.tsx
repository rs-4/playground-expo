import { Stack } from 'expo-router';
import React from 'react';
import '../../global.css';

export default function PlaygroundLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="PlusMenu" />
      <Stack.Screen name="ReminidersNotifications" />
    </Stack>
  );
}
