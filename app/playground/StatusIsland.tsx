import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
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
    <ThemedView className="flex-1 p-5 items-center justify-center">
      <Text className="text-2xl font-bold mb-4 dark:text-white">Status Island Demo</Text>
      <Text className="text-base text-center mb-10 px-5 dark:text-white">
        This component shows status notifications that expand downward from the top of the screen
      </Text>

      <View className="w-full flex-row justify-around mb-5">
        <TouchableOpacity
          className="py-3 px-5 rounded-[10px] min-w-[150px] items-center"
          style={{ backgroundColor: buttonBgSuccess }}
          onPress={() => success('Success ! ')}>
          <Text className="text-black font-semibold">Show Success</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="py-3 px-5 rounded-[10px] min-w-[150px] items-center"
          style={{ backgroundColor: buttonBgError }}
          onPress={() => error('Something wrong!')}>
          <Text className="text-white font-semibold">Show Error</Text>
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
