import React from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import ReminidersNotifications from '@/components/playground/ReminidersNotifications';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';

export default function ReminidersNotificationsScreen() {
  const backgroundColor = useThemeColor({}, 'background');

  return (
    <ThemedView style={styles.container}>
      <ReminidersNotifications />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
