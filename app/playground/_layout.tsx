import { Stack } from 'expo-router';
import React from 'react';

export default function PlaygroundLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="PlusMenu" />
      <Stack.Screen name="ReminidersNotifications" />
    </Stack>
  );
}
