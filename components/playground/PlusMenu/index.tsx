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
    <View className="flex-1" pointerEvents="box-none">
      {(showOptions || isClosing) && (
        <Reanimated.View
          className="absolute inset-0"
          style={[blurStyle, { zIndex: 20 }]}
          pointerEvents="auto">
          <Pressable className="absolute inset-0" onPress={toggle}>
            {Platform.OS === 'ios' ? (
              <BlurView className="absolute inset-0" intensity={blurAmount} tint="dark" />
            ) : (
              <View className="absolute inset-0 bg-black bg-opacity-10" />
            )}
          </Pressable>
        </Reanimated.View>
      )}

      {/* Floating action button & options */}
      <View
        className="absolute left-0 right-0 items-end"
        style={{ bottom: 40, paddingRight: 20, zIndex: 25 }}
        pointerEvents="box-none">
        {/* Main + button */}
        <PlusButtonReanimated
          className="rounded-2xl justify-center items-center shadow-lg"
          style={[
            plusStyle,
            {
              width: 60,
              height: 60,
              marginBottom: 8,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.15,
              shadowRadius: 8,
              elevation: 5,
            },
          ]}>
          <Pressable className="absolute inset-0" onPress={toggle}>
            <PlusBarReanimated
              className="absolute rounded-sm"
              style={[
                hBarStyle,
                {
                  width: 18,
                  height: 2,
                  top: '50%',
                  left: '50%',
                  marginLeft: -9,
                  marginTop: -1,
                },
              ]}
            />
            <PlusBarReanimated
              className="absolute rounded-sm"
              style={[
                vBarStyle,
                {
                  width: 18,
                  height: 2,
                  top: '50%',
                  left: '50%',
                  marginLeft: -9,
                  marginTop: -1,
                },
              ]}
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
