import React, { useState, useEffect } from 'react';
import { View, Pressable, Platform } from 'react-native';
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
    <View className="pointer-events-none flex-1">
      {(showOptions || isClosing) && (
        <Reanimated.View className="pointer-events-auto absolute inset-0 z-10" style={blurStyle}>
          <Pressable className="absolute inset-0" onPress={toggle}>
            {Platform.OS === 'ios' ? (
              <BlurView className="absolute inset-0" intensity={blurAmount} tint="dark" />
            ) : (
              <View className="absolute inset-0" style={{ backgroundColor: 'rgba(0,0,0,0.1)' }} />
            )}
          </Pressable>
        </Reanimated.View>
      )}

      {/* Fixed top blur */}
      <View
        className="pointer-events-none absolute left-0 right-0 top-0"
        style={{ height: STATUSBAR_HEIGHT }}>
        {Platform.OS === 'ios' ? (
          <BlurView
            className="absolute inset-0"
            intensity={30}
            tint={colorScheme === 'dark' ? 'dark' : 'light'}
          />
        ) : (
          <View className="absolute inset-0" style={{ backgroundColor: 'rgba(255,255,255,0.8)' }} />
        )}
      </View>

      {/* Floating action button & options */}
      <View className="pointer-events-box-none absolute bottom-24 right-6 items-center">
        {/* Main + button */}
        <PlusButtonReanimated
          className="h-14 w-14 items-center justify-center rounded-full shadow-lg shadow-black/25"
          style={plusStyle}>
          <Pressable className="absolute inset-0 flex items-center justify-center" onPress={toggle}>
            <PlusBarReanimated
              className="absolute h-[2.5px] w-[18px] rounded-full"
              style={hBarStyle}
            />
            <PlusBarReanimated
              className="absolute h-[2.5px] w-[18px] rounded-full"
              style={vBarStyle}
            />
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
              iconName="document-text-outline"
              title="Text"
              description="Quick notes"
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
