import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import {
  StatusIslandProvider,
  useStatusIsland,
} from '@/components/playground/StatusIsland/context';

function StatusIslandDemo() {
  const { success, error } = useStatusIsland();
  const buttonBgSuccess = useThemeColor({}, 'tint');
  const buttonBgError = '#FF3B30';

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>Status Island Demo</ThemedText>
      <ThemedText style={styles.description}>
        This component shows status notifications that expand downward from the top of the screen
      </ThemedText>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: buttonBgSuccess }]}
          onPress={() => success('Success ! ')}>
          <ThemedText style={styles.buttonText}>Show Success</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: buttonBgError }]}
          onPress={() => error('Something wrong!')}>
          <ThemedText style={styles.buttonText}>Show Error</ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

export default function StatusIslandScreen() {
  return (
    <StatusIslandProvider>
      <StatusIslandDemo />
    </StatusIslandProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  buttonContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    minWidth: 150,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
