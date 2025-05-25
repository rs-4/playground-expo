import React, { useState } from 'react';
import { View, Text, GestureResponderEvent, Animated, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';

interface DarkGradientButtonProps {
  title?: string;
  onPress: (event: GestureResponderEvent) => void;
}

const DarkGradientButton = ({ title = 'Get started', onPress }: DarkGradientButtonProps) => {
  const [animation] = useState(new Animated.Value(0));

  const handlePressIn = () => {
    Animated.timing(animation, {
      toValue: 1,
      duration: 150,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.timing(animation, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start();
  };

  const buttonScale = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.96],
  });

  const buttonOpacity = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.8],
  });

  const animatedStyle = {
    transform: [{ scale: buttonScale }],
    opacity: buttonOpacity,
  };

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        className="rounded-[15px] overflow-hidden pt-8">
        <LinearGradient
          colors={['#34c759', '#2ecc71']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          className="rounded-[15px] py-3.5 px-6 overflow-hidden relative"
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 3,
            elevation: 3,
          }}>
          <View
            className="absolute left-0 right-0 bottom-0 rounded-[15px] z-0"
            style={{
              top: 1.85,
              backgroundColor: 'rgba(0, 0, 0, 0.1)',
            }}
          />

          <View className="flex-row items-center justify-center z-10">
            <Text className="text-white font-semibold text-base mr-2">{title}</Text>
            <Feather name="arrow-right" size={16} color="#FFFFFF" className="mt-0.5" />
          </View>
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
};

export default DarkGradientButton;
