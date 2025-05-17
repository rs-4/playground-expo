// src/components/DynamicIslandNotification.tsx
import React, { useEffect } from 'react';
import {
  Text,
  View,
  StyleSheet,
  useWindowDimensions,
  StatusBar,
  Platform,
  Pressable,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  Easing,
  interpolate,
  runOnJS,
} from 'react-native-reanimated';
import { useStatusBarStore } from './store/useStatusBarStore';

// Valeurs de base pour le calcul des dimensions responsives
const BASE_DYNAMIC_ISLAND_HEIGHT = 38;
const BASE_DYNAMIC_ISLAND_MIN_WIDTH = 126;
const BASE_DYNAMIC_ISLAND_MAX_WIDTH = 350;
const BASE_DYNAMIC_ISLAND_EXPANDED_HEIGHT = 90;
const ANIMATION_DURATION = 350;
const SAFE_TOP = Platform.OS === 'ios' ? 10 : 5;

const TIMING_CONFIG = {
  duration: ANIMATION_DURATION,
  easing: Easing.bezier(0.33, 1, 0.68, 1),
};

const SPRING_CONFIG = {
  damping: 12,
  stiffness: 100,
  mass: 1,
  overshootClamping: false,
  restDisplacementThreshold: 0.01,
  restSpeedThreshold: 2,
};

type Props = {
  message: string;
  onHide: () => void;
};

export default function DynamicIslandNotification({ message, onHide }: Props) {
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const expansion = useSharedValue(0);
  const textOpacity = useSharedValue(0);
  const hidden = useStatusBarStore((s) => s.hidden);

  // Calcul des dimensions responsives basées sur la taille de l'écran
  const dynamicIslandMinWidth = Math.min(BASE_DYNAMIC_ISLAND_MIN_WIDTH, windowWidth * 0.3);
  const dynamicIslandMaxWidth = Math.min(BASE_DYNAMIC_ISLAND_MAX_WIDTH, windowWidth * 0.9);
  const dynamicIslandHeight = Math.min(BASE_DYNAMIC_ISLAND_HEIGHT, windowHeight * 0.05);
  const dynamicIslandExpandedHeight = Math.min(
    BASE_DYNAMIC_ISLAND_EXPANDED_HEIGHT,
    windowHeight * 0.12
  );

  const hideNotification = () => {
    textOpacity.value = withTiming(0, { duration: ANIMATION_DURATION / 2 });

    setTimeout(() => {
      expansion.value = withSpring(0, {
        ...SPRING_CONFIG,
        damping: 15,
        stiffness: 120,
      });
      setTimeout(() => {
        runOnJS(onHide)();
      }, ANIMATION_DURATION);
    }, ANIMATION_DURATION / 2);
  };

  useEffect(() => {
    expansion.value = 0;
    textOpacity.value = 0;

    expansion.value = withSpring(1, SPRING_CONFIG);
    setTimeout(() => {
      textOpacity.value = withTiming(1, { duration: ANIMATION_DURATION / 2 });
    }, ANIMATION_DURATION / 2);

    const timeout = setTimeout(() => {
      hideNotification();
    }, 3000);

    return () => clearTimeout(timeout);
  }, []);

  const dynamicIslandStyle = useAnimatedStyle(() => {
    const width = interpolate(
      expansion.value,
      [0, 1],
      [dynamicIslandMinWidth, dynamicIslandMaxWidth]
    );
    const height = interpolate(
      expansion.value,
      [0, 1],
      [dynamicIslandHeight, dynamicIslandExpandedHeight]
    );
    const borderRadius = interpolate(expansion.value, [0, 1], [20, 37]);

    return {
      width,
      height,
      borderRadius,
    };
  });

  const contentStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ translateY: interpolate(textOpacity.value, [0, 1], [10, 0]) }],
  }));

  return (
    <>
      <StatusBar translucent backgroundColor="transparent" hidden={true} barStyle="light-content" />
      <View style={styles.dynamicIslandContainer}>
        <Pressable style={styles.pressableContainer} onPress={hideNotification}>
          <Animated.View style={[styles.dynamicIsland, dynamicIslandStyle]}>
            <Animated.View style={[styles.notificationContent, contentStyle]}>
              <Text style={styles.notificationText}>{message}</Text>
            </Animated.View>
          </Animated.View>
        </Pressable>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  dynamicIslandContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10000,
    elevation: 10000,
    alignItems: 'center',
    paddingTop: SAFE_TOP,
  },
  pressableContainer: {
    alignItems: 'center',
  },
  dynamicIsland: {
    backgroundColor: '#000',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  notificationContent: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  notificationText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
