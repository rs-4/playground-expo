import React from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import PlusMenu from '@/components/playground/PlusMenu';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';

export default function PlusMenuScreen() {
  const backgroundColor = useThemeColor({}, 'background');

  return (
    <ThemedView style={styles.container}>
      <PlusMenu />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
