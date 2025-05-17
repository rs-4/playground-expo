import React from 'react';
import { StyleSheet, SafeAreaView, Button } from 'react-native';

import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useDynamicIsland } from '@/components/playground/DynamicNotifications/context';

export default function DynamicIslandReloadScreen() {
  const backgroundColor = useThemeColor({}, 'background');
  const { showNotification } = useDynamicIsland();

  return (
    <ThemedView style={styles.container}>
      <Button title="Show Notification" onPress={() => showNotification('Hello, world!')} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
