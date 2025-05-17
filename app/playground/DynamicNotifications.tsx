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
    <ThemedView style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => showNotification('⭐ Hello X, how are you today ?')}>
        <ThemedText style={styles.text}>Click me !</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#0F0F0F',
    padding: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  text: {
    color: 'white',
  },
});
