import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';

import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useDynamicIsland } from '@/components/playground/DynamicNotifications/context';

export default function DynamicIslandReloadScreen() {
  const backgroundColor = useThemeColor({}, 'background');
  const { showNotification } = useDynamicIsland();

  return (
    <ThemedView className="flex-1 justify-center items-center">
      <TouchableOpacity
        className="bg-[#0F0F0F] p-4 px-10 rounded-2xl"
        onPress={() => showNotification('⭐ Hello X, how are you today ?')}>
        <ThemedText className="text-white">Click me !</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}
