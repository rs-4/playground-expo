// Dynamic Island Notification Component for Mobile Apps
// This component mimics the iOS Dynamic Island notification style
import React, { useEffect } from 'react';
import { Text, View, useWindowDimensions, StatusBar, Platform, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  Easing,
  interpolate,
  runOnJS,
} from 'react-native-reanimated';

// Base values for responsive dimension calculations
const BASE_DYNAMIC_ISLAND_HEIGHT = 38; // Default island height
const BASE_DYNAMIC_ISLAND_MIN_WIDTH = 126; // Minimum width when collapsed
const BASE_DYNAMIC_ISLAND_MAX_WIDTH = 350; // Maximum width when expanded
const BASE_DYNAMIC_ISLAND_EXPANDED_HEIGHT = 90; // Height when expanded
const ANIMATION_DURATION = 350; // Duration of animations in ms
const SAFE_TOP = Platform.OS === 'ios' ? 10 : 5; // Top padding based on platform

// Component Props Interface
type Props = {
  message: string; // Notification message to display
  onHide: () => void; // Callback when notification is hidden
};

export default function DynamicIslandNotification({ message, onHide }: Props) {
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const expansion = useSharedValue(0); // Controls expansion animation (0-1)
  const textOpacity = useSharedValue(0); // Controls text fade animation (0-1)

  // Calculate responsive dimensions based on screen size
  const dynamicIslandMinWidth = Math.min(BASE_DYNAMIC_ISLAND_MIN_WIDTH, windowWidth * 0.3);
  const dynamicIslandMaxWidth = Math.min(BASE_DYNAMIC_ISLAND_MAX_WIDTH, windowWidth * 0.9);
  const dynamicIslandHeight = Math.min(BASE_DYNAMIC_ISLAND_HEIGHT, windowHeight * 0.05);
  const dynamicIslandExpandedHeight = Math.min(
    BASE_DYNAMIC_ISLAND_EXPANDED_HEIGHT,
    windowHeight * 0.12
  );

  // Function to hide the notification with animation
  const hideNotification = () => {
    // First fade out the text
    textOpacity.value = withTiming(0, { duration: ANIMATION_DURATION / 2 });

    setTimeout(() => {
      // Then collapse the island with bouncy spring animation
      expansion.value = withSpring(0, {
        damping: 8, // Lower damping for more bounce
        stiffness: 150, // Higher stiffness for faster animation
        mass: 0.8, // Lower mass for more responsiveness
        velocity: 3, // Initial velocity for more dynamic feel
        overshootClamping: false, // Allow overshooting for bounce effect
        restDisplacementThreshold: 0.01,
        restSpeedThreshold: 2,
      });
      setTimeout(() => {
        // Finally call the onHide callback
        runOnJS(onHide)();
      }, ANIMATION_DURATION);
    }, ANIMATION_DURATION / 2);
  };

  // Initialize and set up animations on component mount
  useEffect(() => {
    // Reset animation values
    expansion.value = 0;
    textOpacity.value = 0;

    // Start island expansion animation with bounce effect
    expansion.value = withSpring(1, {
      damping: 10, // Moderate damping for natural bounce
      stiffness: 100, // Moderate stiffness
      velocity: 3, // Initial velocity for quick start
      mass: 0.7, // Lighter mass for quicker movement
      overshootClamping: false, // Allow overshooting for bounce effect
      restDisplacementThreshold: 0.01,
      restSpeedThreshold: 2,
    });

    // Fade in text after island expansion starts
    setTimeout(() => {
      textOpacity.value = withTiming(1, { duration: ANIMATION_DURATION / 2 });
    }, ANIMATION_DURATION / 2);

    // Auto-hide the notification after 3 seconds
    const timeout = setTimeout(() => {
      hideNotification();
    }, 3000);

    // Clean up on unmount
    return () => clearTimeout(timeout);
  }, []);

  // Animated styles for the dynamic island container
  const dynamicIslandStyle = useAnimatedStyle(() => {
    // Interpolate width from min to max based on expansion value
    const width = interpolate(
      expansion.value,
      [0, 1],
      [dynamicIslandMinWidth, dynamicIslandMaxWidth]
    );

    // Interpolate height from collapsed to expanded
    const height = interpolate(
      expansion.value,
      [0, 1],
      [dynamicIslandHeight, dynamicIslandExpandedHeight]
    );

    // Interpolate border radius for smooth corner transition
    const borderRadius = interpolate(expansion.value, [0, 1], [20, 37]);

    // Scale effect for more natural expanding/collapsing animation
    const scale = interpolate(expansion.value, [0, 0.3, 1], [0.85, 0.95, 1], 'clamp');

    return {
      width,
      height,
      borderRadius,
      transform: [{ scale }], // Apply scale transform
    };
  });

  // Animated styles for the notification content (text)
  const contentStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value, // Fade in/out text
    transform: [{ translateY: interpolate(textOpacity.value, [0, 1], [10, 0]) }], // Slide up animation
  }));

  return (
    <>
      {/* Set Status Bar to translucent and hidden */}
      <StatusBar translucent backgroundColor="transparent" hidden={true} barStyle="light-content" />

      {/* Main container positioned at the top of the screen */}
      <View
        className="absolute top-0 left-0 right-0 z-[10000] items-center overflow-hidden"
        style={{ paddingTop: SAFE_TOP, elevation: 10000 }}>
        {/* Pressable wrapper to handle tap to dismiss */}
        <Pressable className="items-center" onPress={hideNotification}>
          {/* Animated Dynamic Island */}
          <Animated.View
            className="bg-black overflow-hidden items-center justify-center"
            style={[
              dynamicIslandStyle,
              {
                transform: [{ translateY: -2 }], // Offset to prevent overflow at the top
              },
            ]}>
            {/* Content container with notification message */}
            <Animated.View
              className="w-full h-full items-center justify-center px-5"
              style={contentStyle}>
              <Text className="text-white text-base font-semibold text-center">{message}</Text>
            </Animated.View>
          </Animated.View>
        </Pressable>
      </View>
    </>
  );
}
