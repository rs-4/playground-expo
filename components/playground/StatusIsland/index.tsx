// Status Island Component for Mobile Apps
// This component extends downward to show success or error status
import React, { useEffect } from 'react';
import { Text, View, StyleSheet, useWindowDimensions, Platform, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  Easing,
  interpolate,
  runOnJS,
  withSequence,
  withDelay,
  interpolateColor,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/useColorScheme';

// Base values for responsive dimension calculations - adjusted to match real Dynamic Island
const BASE_STATUS_ISLAND_HEIGHT = 36; // Default island height
const BASE_STATUS_ISLAND_MIN_WIDTH = 126; // Minimum width when collapsed
const BASE_STATUS_ISLAND_MAX_WIDTH = 150; // Maximum width when expanded
const BASE_STATUS_ISLAND_EXPANDED_HEIGHT = 150; // Height when expanded
const ANIMATION_DURATION = 350; // Duration of animations in ms
const SAFE_TOP = Platform.OS === 'ios' ? 11 : 5; // Top padding to position properly
const MAX_TEXT_LENGTH = 18; // Maximum number of characters for the message
const ICON_SAFE_TOP = Platform.OS === 'ios' ? 30 : 20; // Safe padding to avoid real Dynamic Island

// Animation timing configuration
const TIMING_CONFIG = {
  duration: ANIMATION_DURATION,
  easing: Easing.bezier(0.33, 1, 0.68, 1), // Smooth cubic bezier curve
};

// Component Props Interface
type StatusType = 'success' | 'error';

type Props = {
  statusType: StatusType;
  message?: string;
  onHide: () => void;
};

export default function StatusIsland({ statusType, message, onHide }: Props) {
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const expansion = useSharedValue(0); // Controls expansion animation (0-1)
  const textOpacity = useSharedValue(0); // Controls text fade animation (0-1)
  const iconScale = useSharedValue(0); // Controls icon scale animation
  const iconRotation = useSharedValue(0); // Controls icon rotation
  const colorScheme = useColorScheme(); // Current theme (light/dark)
  const shadowColor = colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)';

  // Truncate message if needed
  const truncatedMessage =
    message && message.length > MAX_TEXT_LENGTH
      ? `${message.substring(0, MAX_TEXT_LENGTH)}...`
      : message;

  // Icon configurations
  const getIconConfig = () => {
    if (statusType === 'success') {
      return {
        name: 'checkmark-circle', // Solid icon
        color: '#4CD964',
        borderColor: 'rgba(76, 217, 100, 0.6)',
        backgroundColor: 'rgba(76, 217, 100, 0.1)',
      };
    } else {
      return {
        name: 'close-circle', // Solid icon
        color: '#FF3B30',
        borderColor: 'rgba(255, 59, 48, 0.6)',
        backgroundColor: 'rgba(255, 59, 48, 0.1)',
      };
    }
  };

  const iconConfig = getIconConfig();

  // Calculate responsive dimensions based on screen size
  const statusIslandMinWidth = Math.min(BASE_STATUS_ISLAND_MIN_WIDTH, windowWidth * 0.3);
  const statusIslandMaxWidth = Math.min(BASE_STATUS_ISLAND_MAX_WIDTH, windowWidth * 0.5);
  const statusIslandHeight = Math.min(BASE_STATUS_ISLAND_HEIGHT, windowHeight * 0.05);

  // Permettre une hauteur personnalisée plus grande en supprimant la limitation à 15% de l'écran
  const statusIslandExpandedHeight = BASE_STATUS_ISLAND_EXPANDED_HEIGHT;

  // Function to hide the notification with animation
  const hideNotification = () => {
    // First fade out the text and icon
    textOpacity.value = withTiming(0, { duration: ANIMATION_DURATION / 2 });
    iconScale.value = withTiming(0, { duration: ANIMATION_DURATION / 2 });

    setTimeout(() => {
      // Then collapse the island with bouncy spring animation
      expansion.value = withSpring(0, {
        damping: 12,
        stiffness: 150,
        mass: 0.8,
        velocity: 2,
        overshootClamping: true,
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
    iconScale.value = 0;
    iconRotation.value = 0;

    // Start island expansion animation with bounce effect
    expansion.value = withSpring(1, {
      damping: 15,
      stiffness: 120,
      velocity: 1.5,
      mass: 0.9,
      overshootClamping: true,
      restDisplacementThreshold: 0.01,
      restSpeedThreshold: 2,
    });

    // Animate the icon with a bounce effect
    iconScale.value = withDelay(
      ANIMATION_DURATION / 2,
      withSequence(
        withTiming(1.2, { duration: 200 }),
        withSpring(1, {
          damping: 12,
          stiffness: 100,
        })
      )
    );

    // Rotate the icon slightly to give it some life
    iconRotation.value = withDelay(
      ANIMATION_DURATION / 2,
      withSequence(
        withTiming(-0.1, { duration: 100 }),
        withTiming(0.1, { duration: 200 }),
        withTiming(0, { duration: 100 })
      )
    );

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

  // Animated styles for the status island container
  const statusIslandStyle = useAnimatedStyle(() => {
    // Interpolate width from min to max based on expansion value
    const width = interpolate(
      expansion.value,
      [0, 1],
      [statusIslandMinWidth, statusIslandMaxWidth]
    );

    // Interpolate height from collapsed to expanded (downward expansion)
    const height = interpolate(
      expansion.value,
      [0, 1],
      [statusIslandHeight, statusIslandExpandedHeight]
    );

    // Interpolate border radius for smooth corner transition
    const borderRadius = interpolate(expansion.value, [0, 1], [20, 25]);

    return {
      width,
      height,
      borderRadius,
    };
  });

  // Animated styles for the notification content (text and icon)
  const contentStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ translateY: interpolate(textOpacity.value, [0, 1], [10, 0]) }],
  }));

  // Animated styles for the icon
  const iconStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: iconScale.value }, { rotate: `${iconRotation.value}rad` }],
    };
  });

  // Animated styles for the text message
  const textStyle = useAnimatedStyle(() => {
    const color = statusType === 'success' ? '#4CD964' : '#FF3B30';

    return {
      color: withTiming(color, { duration: 300 }),
      opacity: textOpacity.value,
      transform: [{ translateY: interpolate(textOpacity.value, [0, 1], [5, 0]) }],
    };
  });

  return (
    <View style={styles.statusIslandContainer}>
      <Pressable style={styles.pressableContainer} onPress={hideNotification}>
        <Animated.View
          style={[
            styles.statusIsland,
            statusIslandStyle,
            {
              shadowColor: shadowColor,
            },
          ]}>
          {/* Je restructure complètement le contenu pour un meilleur positionnement */}
          <View style={styles.safeAreaTop} />

          <View style={styles.centeredContent}>
            <Animated.View
              style={[styles.iconContainer, iconStyle, { borderColor: iconConfig.borderColor }]}>
              <Ionicons name={iconConfig.name as any} size={38} color={iconConfig.color} />
            </Animated.View>
          </View>

          {truncatedMessage && (
            <Animated.View style={[styles.textContainer, contentStyle]}>
              <Animated.Text style={[styles.messageText, textStyle]}>
                {truncatedMessage}
              </Animated.Text>
            </Animated.View>
          )}
        </Animated.View>
      </Pressable>
    </View>
  );
}

// Component styles
const styles = StyleSheet.create({
  statusIslandContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10000,
    elevation: 10000,
    alignItems: 'center',
    paddingTop: SAFE_TOP,
    overflow: 'hidden',
  },
  pressableContainer: {
    alignItems: 'center',
  },
  statusIsland: {
    backgroundColor: '#000',
    overflow: 'hidden',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingBottom: 15,
  },
  safeAreaTop: {
    height: ICON_SAFE_TOP, // Zone de sécurité pour éviter la vraie Dynamic Island
  },
  centeredContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  textContainer: {
    width: '100%',
    paddingHorizontal: 12,
    paddingBottom: 5,
  },
  messageText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});
