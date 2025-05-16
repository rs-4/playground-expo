import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Pressable, Platform } from 'react-native';
import Constants from 'expo-constants';
import { BlurView } from 'expo-blur';
import Reanimated, {
  useSharedValue,
  withTiming,
  withSpring,
  useAnimatedStyle,
  interpolateColor,
  Easing,
} from 'react-native-reanimated';
import { hapticWithSequence } from '@/utils/haptics';
import OptionButton from '@/components/OptionButton';
import { useColorScheme } from '@/hooks/useColorScheme';
const STATUSBAR_HEIGHT = Constants.statusBarHeight;

const PlusButtonReanimated = Reanimated.createAnimatedComponent(View);
const PlusBarReanimated = Reanimated.createAnimatedComponent(View);

const PlusMenu: React.FC = () => {
  const colorScheme = useColorScheme();
  /* --------------------------------------------------
   * State
   * ------------------------------------------------*/
  const [showOptions, setShowOptions] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [blurAmount, setBlurAmount] = useState(0);

  /* --------------------------------------------------
   * Reanimated shared values (no more RN Animated!)
   * ------------------------------------------------*/
  const plusRotation = useSharedValue(0);
  const plusBg = useSharedValue(0);
  const plusBarColor = useSharedValue(0);

  // four action buttons
  const offsets = Array.from({ length: 4 }, () => useSharedValue(0));
  const opacities = Array.from({ length: 4 }, () => useSharedValue(0));

  /* --------------------------------------------------
   * Animated styles
   * ------------------------------------------------*/
  const plusStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(plusBg.value, [0, 1], ['#ffffff', '#000000']),
  }));

  const hBarStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${plusRotation.value}deg` }],
    backgroundColor: interpolateColor(plusBarColor.value, [0, 1], ['#000000', '#ffffff']),
  }));

  const vBarStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: '90deg' }, { rotate: `${plusRotation.value}deg` }],
    backgroundColor: interpolateColor(plusBarColor.value, [0, 1], ['#000000', '#ffffff']),
  }));

  /* --------------------------------------------------
   * Blur (simple CSS fallback on Android)
   * ------------------------------------------------*/
  const blurOpacity = useSharedValue(0);
  const blurStyle = useAnimatedStyle(() => ({ opacity: blurOpacity.value }));

  /* --------------------------------------------------
   * Helpers
   * ------------------------------------------------*/
  const resetButtonStates = () => {
    offsets.forEach((o) => (o.value = 0));
    opacities.forEach((o) => (o.value = 0));
  };

  const openMenu = () => {
    setShowOptions(true);
    resetButtonStates();

    // Haptic ► heavy
    hapticWithSequence(['O']);

    // Plus button morph
    plusRotation.value = withTiming(45, {
      duration: 300,
      easing: Easing.inOut(Easing.ease),
    });
    plusBg.value = withTiming(1, {
      duration: 300,
      easing: Easing.inOut(Easing.ease),
    });
    plusBarColor.value = withTiming(1, {
      duration: 300,
      easing: Easing.inOut(Easing.ease),
    });

    // Blur in
    blurOpacity.value = withTiming(1, { duration: 150 });
    setBlurAmount(30);

    // Wave‑like rise of buttons (bottom → top)
    const baseDelay = 80;
    offsets.forEach((offset, idx) => {
      setTimeout(
        () => {
          opacities[idx].value = 1;
          offset.value = withSpring(-80 * (idx + 1), {
            damping: 15,
            stiffness: 180,
          });
        },
        baseDelay * (idx + 1)
      );
    });
  };

  const closeMenu = () => {
    setIsClosing(true);

    // Haptic ► medium
    hapticWithSequence(['o']);

    // Reverse the plus morph
    plusRotation.value = withTiming(0, {
      duration: 300,
      easing: Easing.inOut(Easing.ease),
    });
    plusBg.value = withTiming(0, {
      duration: 300,
      easing: Easing.inOut(Easing.ease),
    });
    plusBarColor.value = withTiming(0, {
      duration: 300,
      easing: Easing.inOut(Easing.ease),
    });

    // Buttons fall (top → bottom)
    const fallDelay = 50;
    offsets.forEach((offset, idx) => {
      const reverseIdx = offsets.length - idx - 1;
      setTimeout(() => {
        offset.value = withTiming(150, {
          duration: 400,
          easing: Easing.in(Easing.cubic),
        });
        opacities[reverseIdx].value = withTiming(0, { duration: 350 });
      }, fallDelay * idx);
    });

    // Blur out
    blurOpacity.value = withTiming(0, { duration: 600 });

    // Cleanup
    setTimeout(() => {
      setIsClosing(false);
      setShowOptions(false);
    }, 650);
  };

  const toggle = () => {
    if (isClosing) return; // Ignore taps while closing
    showOptions ? closeMenu() : openMenu();
  };

  /* --------------------------------------------------
   * Render
   * ------------------------------------------------*/
  return (
    <View style={styles.container} pointerEvents="box-none">
      {(showOptions || isClosing) && (
        <Reanimated.View style={[styles.blurOverlay, blurStyle]} pointerEvents="auto">
          <Pressable style={StyleSheet.absoluteFill} onPress={toggle}>
            {Platform.OS === 'ios' ? (
              <BlurView style={StyleSheet.absoluteFill} intensity={blurAmount} tint="dark" />
            ) : (
              <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.1)' }]} />
            )}
          </Pressable>
        </Reanimated.View>
      )}

      {/* Fixed top blur */}
      <View style={styles.topBlur} pointerEvents="none">
        {Platform.OS === 'ios' ? (
          <BlurView
            style={StyleSheet.absoluteFill}
            intensity={30}
            tint={colorScheme === 'dark' ? 'dark' : 'light'}
          />
        ) : (
          <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(255,255,255,0.8)' }]} />
        )}
      </View>

      {/* Floating action button & options */}
      <View style={styles.bottomBar} pointerEvents="box-none">
        {/* Main + button */}
        <PlusButtonReanimated style={[styles.plusBtn, plusStyle]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={toggle}>
            <PlusBarReanimated style={[styles.plusBar, hBarStyle]} />
            <PlusBarReanimated style={[styles.plusBar, vBarStyle]} />
          </Pressable>
        </PlusButtonReanimated>

        {/* Action buttons */}
        {(showOptions || isClosing) && (
          <>
            <OptionButton
              iconName="camera-outline"
              title="Pictures"
              description="Take a picture"
              translateY={offsets[0]}
              opacity={opacities[0]}
            />
            <OptionButton
              iconName="qr-code-outline"
              title="Scan QR"
              description="Scan QR code"
              translateY={offsets[1]}
              opacity={opacities[1]}
            />
            <OptionButton
              iconName="mic-outline"
              title="Recording"
              description="Voice thoughts"
              translateY={offsets[2]}
              opacity={opacities[2]}
            />
            <OptionButton
              iconName="create-outline"
              title="Text"
              description="Write your meal manually"
              translateY={offsets[3]}
              opacity={opacities[3]}
            />
          </>
        )}
      </View>
    </View>
  );
};

export default PlusMenu;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  blurOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 20,
  },
  topBlur: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: STATUSBAR_HEIGHT + 80,
    zIndex: 15,
    overflow: 'hidden',
  },
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 40,
    alignItems: 'flex-end',
    paddingRight: 20,
    zIndex: 25,
  },
  plusBtn: {
    width: 60,
    height: 60,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 8,
  },
  plusBar: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 18,
    height: 2,
    borderRadius: 1,
    marginLeft: -9, // centers horizontally
    marginTop: -1, // centers vertically
  },
});
