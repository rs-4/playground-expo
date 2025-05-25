import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Reanimated, { SharedValue, useAnimatedStyle } from 'react-native-reanimated';

interface OptionButtonProps {
  iconName: React.ComponentProps<typeof Ionicons>['name'];
  title: string;
  description: string;
  translateY: SharedValue<number>;
  opacity: SharedValue<number>;
}

const OptionButton: React.FC<OptionButtonProps> = ({
  iconName,
  title,
  description,
  translateY,
  opacity,
}) => {
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return (
    <Reanimated.View
      className="absolute left-5 right-5 min-h-[60px] flex-row items-center justify-between"
      style={animatedStyle}>
      <View className="flex-shrink mr-3" pointerEvents="none">
        <Text className="text-[white] text-lg font-bold opacity-75">{title}</Text>
        <Text className="text-[#666] text-sm">{description}</Text>
      </View>

      <View
        className="w-[60px] h-[60px] rounded-2xl bg-white justify-center items-center shadow-lg"
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 8,
          elevation: 5,
        }}
        pointerEvents="none">
        <Ionicons name={iconName} size={24} color="#000" />
      </View>
    </Reanimated.View>
  );
};

export default OptionButton;
