import React, { useState, useRef, useEffect } from 'react';
import { View, TouchableOpacity, Animated, Easing, Platform, Dimensions, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/ThemedText';
import { darkGradient } from '@/constants/Colors';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useRouter } from 'expo-router';

export interface MenuItem {
  icon: string;
  label: string;
  onPress?: () => void;
  isLogout?: boolean;
}

interface FloatingMenuProps {
  greeting?: string;
  userName?: string;
  menuItems: MenuItem[];
  extraTopPadding?: number;
  onMenuToggle?: (isOpen: boolean) => void;
}

const FloatingMenu = ({
  greeting = 'Hello',
  userName = 'John',
  menuItems,
  extraTopPadding = 0,
  onMenuToggle,
}: FloatingMenuProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const headerHeight = useRef(new Animated.Value(0)).current;
  const iconRotate = useRef(new Animated.Value(0)).current;
  const iconScale = useRef(new Animated.Value(1)).current;
  const crossOpacity = useRef(new Animated.Value(0)).current;
  const menuItemsOpacity = useRef(new Animated.Value(0)).current;
  const menuItemAnimations = useRef(
    Array(menuItems.length)
      .fill(0)
      .map(() => new Animated.Value(0))
  ).current;
  const menuBlurAnimation = useRef(new Animated.Value(0)).current;
  const menuTextAnimations = useRef(
    Array(menuItems.length)
      .fill(0)
      .map(() => new Animated.Value(0))
  ).current;

  // Animation for the 3D parallax effect - fixed for TypeScript
  const menuItemDepth = useRef(
    Array(menuItems.length)
      .fill(0)
      .map(() => new Animated.Value(20))
  ).current;

  // Animation for icons with spring effect
  const menuItemIconScale = useRef(
    Array(menuItems.length)
      .fill(0)
      .map(() => new Animated.Value(0))
  ).current;

  // Animation for the header title
  const greetingScale = useRef(new Animated.Value(1)).current;
  const greetingTranslateY = useRef(new Animated.Value(0)).current;

  // Animation for the header background
  const headerBgOpacity = useRef(new Animated.Value(1)).current;
  const headerBgScale = useRef(new Animated.Value(1)).current;

  const insets = useSafeAreaInsets();
  const isDark = useThemeColor({}, 'background') === '#151718';
  const router = useRouter();

  const rotateInterpolation = iconRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '90deg'],
  });

  const blurInterpolation = menuBlurAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 10],
  });

  const toggleMenu = () => {
    const newMenuState = !menuOpen;
    setMenuOpen(newMenuState);

    // Inform the parent of the menu state change
    if (onMenuToggle) {
      onMenuToggle(newMenuState);
    }

    if (newMenuState) {
      // Opening the menu with sequential animations
      Animated.parallel([
        Animated.timing(headerHeight, {
          toValue: Math.min(240, 70 + menuItems.length * 50),
          duration: 400,
          easing: Easing.bezier(0.16, 1, 0.3, 1),
          useNativeDriver: false,
        }),
        Animated.timing(iconScale, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(crossOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(iconRotate, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(menuBlurAnimation, {
          toValue: 1,
          duration: 400,
          useNativeDriver: false,
        }),
        // Animation of the global content opacity
        Animated.timing(menuItemsOpacity, {
          toValue: 1,
          duration: 300,
          delay: 100,
          useNativeDriver: true,
        }),

        // Animation of the header title
        Animated.timing(greetingScale, {
          toValue: 0.95,
          duration: 400,
          easing: Easing.bezier(0.16, 1, 0.3, 1),
          useNativeDriver: true,
        }),
        Animated.timing(greetingTranslateY, {
          toValue: -5,
          duration: 400,
          easing: Easing.bezier(0.16, 1, 0.3, 1),
          useNativeDriver: true,
        }),

        // Animation of the header background
        Animated.timing(headerBgOpacity, {
          toValue: 0.9,
          duration: 350,
          easing: Easing.bezier(0.16, 1, 0.3, 1),
          useNativeDriver: true,
        }),
        Animated.timing(headerBgScale, {
          toValue: 1.03,
          duration: 400,
          easing: Easing.bezier(0.16, 1, 0.3, 1),
          useNativeDriver: true,
        }),
      ]).start();

      // Sequential animation of menu items with 3D effect
      menuItemAnimations.forEach((anim, index) => {
        Animated.timing(anim, {
          toValue: 1,
          duration: 400,
          delay: 120 + index * 60,
          easing: Easing.bezier(0.25, 1, 0.5, 1),
          useNativeDriver: true,
        }).start();

        // Animation for the parallax effect
        Animated.timing(menuItemDepth[index], {
          toValue: 0,
          duration: 600,
          delay: 150 + index * 80,
          easing: Easing.bezier(0.25, 1, 0.5, 1),
          useNativeDriver: true,
        }).start();

        // Softer spring animation for the icon
        Animated.spring(menuItemIconScale[index], {
          toValue: 1.15, // Lower maximum value (1.3 → 1.15)
          friction: 8, // Higher friction for fewer bounces (3 → 8)
          tension: 30, // Lower tension for a softer effect (50 → 30)
          useNativeDriver: true,
          delay: 150 + index * 60,
        }).start();
      });

      // Animation of texts
      menuTextAnimations.forEach((anim, index) => {
        Animated.timing(anim, {
          toValue: 1,
          duration: 400,
          delay: 250 + index * 60, // Delay for texts
          easing: Easing.bezier(0.25, 1, 0.5, 1),
          useNativeDriver: true,
        }).start();
      });
    } else {
      // Closing the menu
      Animated.parallel([
        Animated.timing(headerHeight, {
          toValue: 0,
          duration: 300,
          easing: Easing.bezier(0.16, 1, 0.3, 1),
          useNativeDriver: false,
        }),
        Animated.timing(iconScale, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(crossOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(iconRotate, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(menuBlurAnimation, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(menuItemsOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),

        // Animation of the header title
        Animated.timing(greetingScale, {
          toValue: 1,
          duration: 350,
          easing: Easing.bezier(0.16, 1, 0.3, 1),
          useNativeDriver: true,
        }),
        Animated.timing(greetingTranslateY, {
          toValue: 0,
          duration: 350,
          easing: Easing.bezier(0.16, 1, 0.3, 1),
          useNativeDriver: true,
        }),

        // Animation of the header background
        Animated.timing(headerBgOpacity, {
          toValue: 1,
          duration: 300,
          easing: Easing.bezier(0.16, 1, 0.3, 1),
          useNativeDriver: true,
        }),
        Animated.timing(headerBgScale, {
          toValue: 1,
          duration: 350,
          easing: Easing.bezier(0.16, 1, 0.3, 1),
          useNativeDriver: true,
        }),
      ]).start();

      // Reset animations of menu items
      menuItemAnimations.forEach((anim, index) => {
        Animated.timing(anim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start();

        // Animation for the parallax effect
        Animated.timing(menuItemDepth[index], {
          toValue: 20,
          duration: 250,
          easing: Easing.bezier(0.16, 1, 0.3, 1),
          useNativeDriver: true,
        }).start();

        // Reset icon animations - smoother closing
        Animated.timing(menuItemIconScale[index], {
          toValue: 0,
          duration: 200,
          easing: Easing.bezier(0.25, 1, 0.5, 1),
          useNativeDriver: true,
        }).start();
      });

      // Reset text animations
      menuTextAnimations.forEach((anim) => {
        Animated.timing(anim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }).start();
      });
    }
  };

  const handleItemPress = (item: MenuItem, index: number) => {
    if (item.onPress) {
      item.onPress();
    }

    // Close the menu after clicking on an item
    toggleMenu();
  };

  return (
    <>
      {/* Navigation menu */}
      <View
        className="z-10 flex-col overflow-hidden rounded-b-[24px] shadow-md shadow-black/10"
        style={{
          paddingTop: insets.top + extraTopPadding || (Platform.OS === 'ios' ? 60 : 40),
        }}>
        <Animated.View
          className="absolute inset-0"
          style={{
            transform: [{ scale: headerBgScale }],
            opacity: headerBgOpacity,
          }}>
          <LinearGradient
            colors={[darkGradient.top, darkGradient.middle, darkGradient.bottom]}
            locations={[0, 0.6, 1]}
            className="absolute inset-0"
            style={{
              borderBottomLeftRadius: menuOpen ? 0 : 24,
              borderBottomRightRadius: menuOpen ? 0 : 24,
            }}
          />
        </Animated.View>

        <View className="flex-row items-center justify-between px-6 py-4">
          <Animated.View
            className="flex-row items-center"
            style={{
              transform: [{ scale: greetingScale }, { translateY: greetingTranslateY }],
            }}>
            <ThemedText type="defaultSemiBold" className="text-lg tracking-wider text-white">
              {greeting}{' '}
              <ThemedText className="font-normal italic text-white">{userName}</ThemedText> 👋
            </ThemedText>
          </Animated.View>
          <TouchableOpacity onPress={toggleMenu} className="relative p-1" activeOpacity={0.8}>
            <View
              className="h-9 w-9 items-center justify-center rounded-full shadow-sm shadow-black/10"
              style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}>
              <Animated.View
                className="absolute"
                style={{
                  transform: [{ scale: iconScale }, { rotate: rotateInterpolation }],
                }}>
                <Ionicons name="person" size={18} color="#fff" />
              </Animated.View>
              <Animated.View
                className="absolute"
                style={{
                  opacity: crossOpacity,
                }}>
                <Ionicons name="close" size={18} color="#fff" />
              </Animated.View>
            </View>
          </TouchableOpacity>
        </View>

        <Animated.View className="overflow-hidden" style={{ height: headerHeight }}>
          <Animated.View
            className="px-6 pb-4 pt-2"
            style={{
              opacity: menuItemsOpacity,
              filter: Platform.OS === 'web' ? `blur(${blurInterpolation}px)` : undefined,
            }}>
            {menuItems.map((item, index) => (
              <Animated.View
                key={index}
                style={{
                  opacity: menuItemAnimations[index],
                  transform: [
                    {
                      translateY: menuItemAnimations[index].interpolate({
                        inputRange: [0, 1],
                        outputRange: [15, 0],
                      }),
                    },
                    // Uses translateX with larger values to simulate a 3D effect
                    {
                      translateX: menuItemDepth[index].interpolate({
                        inputRange: [0, 20],
                        outputRange: [0, -5],
                      }),
                    },
                  ],
                }}>
                <TouchableOpacity
                  className="mb-0.5 flex-row items-center px-2.5 py-3.5"
                  style={{
                    transform: [{ perspective: 1000 }],
                  }}
                  onPress={() => handleItemPress(item, index)}
                  activeOpacity={0.7}>
                  <Animated.View
                    style={{
                      transform: [
                        {
                          scale: menuItemIconScale[index],
                        },
                        {
                          // Slight horizontal sliding effect for icons
                          translateX: menuItemAnimations[index].interpolate({
                            inputRange: [0, 1],
                            outputRange: [-15, 0],
                          }),
                        },
                      ],
                    }}>
                    <Ionicons
                      name={item.icon as any}
                      size={20}
                      color={item.isLogout ? '#FF3B30' : '#fff'}
                      className="mr-5 w-6 text-center"
                    />
                  </Animated.View>

                  <Animated.View
                    style={{
                      opacity: menuTextAnimations[index],
                      transform: [
                        {
                          translateX: menuTextAnimations[index].interpolate({
                            inputRange: [0, 1],
                            outputRange: [-10, 0],
                          }),
                        },
                      ],
                    }}>
                    <ThemedText
                      className={`text-[17px] font-medium italic tracking-wider ${
                        item.isLogout ? 'font-semibold text-[#FF3B30]' : 'text-white'
                      }`}>
                      {item.label}
                    </ThemedText>
                  </Animated.View>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </Animated.View>
        </Animated.View>
      </View>
    </>
  );
};

export default FloatingMenu;
