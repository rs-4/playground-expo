import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
  Platform,
  Dimensions,
  Text,
} from 'react-native';
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
        style={[
          styles.header,
          {
            paddingTop: insets.top + extraTopPadding || (Platform.OS === 'ios' ? 60 : 40),
            zIndex: 10,
          },
        ]}>
        <Animated.View
          style={{
            ...StyleSheet.absoluteFillObject,
            transform: [{ scale: headerBgScale }],
            opacity: headerBgOpacity,
          }}>
          <LinearGradient
            colors={[darkGradient.top, darkGradient.middle, darkGradient.bottom]}
            locations={[0, 0.6, 1]}
            style={[
              StyleSheet.absoluteFill,
              {
                borderBottomLeftRadius: menuOpen ? 0 : 24,
                borderBottomRightRadius: menuOpen ? 0 : 24,
              },
            ]}
          />
        </Animated.View>

        <View style={styles.headerContent}>
          <Animated.View
            style={[
              styles.headerLeft,
              {
                transform: [{ scale: greetingScale }, { translateY: greetingTranslateY }],
              },
            ]}>
            <ThemedText type="defaultSemiBold" style={styles.greeting}>
              {greeting} <ThemedText style={styles.nameText}>{userName}</ThemedText> 👋
            </ThemedText>
          </Animated.View>
          <TouchableOpacity onPress={toggleMenu} style={styles.userIconButton} activeOpacity={0.8}>
            <View style={[styles.userIconContainer, { backgroundColor: 'rgba(255,255,255,0.15)' }]}>
              <Animated.View
                style={{
                  transform: [{ scale: iconScale }, { rotate: rotateInterpolation }],
                  position: 'absolute',
                }}>
                <Ionicons name="person" size={18} color="#fff" />
              </Animated.View>
              <Animated.View
                style={{
                  opacity: crossOpacity,
                  position: 'absolute',
                }}>
                <Ionicons name="close" size={18} color="#fff" />
              </Animated.View>
            </View>
          </TouchableOpacity>
        </View>

        <Animated.View style={[styles.menuContainer, { height: headerHeight }]}>
          <Animated.View
            style={[
              styles.menuContent,
              {
                opacity: menuItemsOpacity,
                filter: Platform.OS === 'web' ? `blur(${blurInterpolation}px)` : undefined,
              },
            ]}>
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
                  style={[
                    styles.menuItem,
                    {
                      transform: [{ perspective: 1000 }],
                    },
                  ]}
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
                      style={styles.menuItemIcon}
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
                      style={[styles.menuItemText, item.isLogout ? styles.logoutText : null]}>
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

const styles = StyleSheet.create({
  header: {
    flexDirection: 'column',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    zIndex: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 18,
    color: '#fff',
    letterSpacing: 0.2,
  },
  nameText: {
    fontStyle: 'italic',
    fontWeight: 'normal',
    color: '#fff',
  },
  userIconButton: {
    position: 'relative',
    padding: 4,
  },
  userIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  menuContainer: {
    overflow: 'hidden',
  },
  menuContent: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 10,
    marginBottom: 2,
  },
  menuItemIcon: {
    marginRight: 20,
    width: 24,
    textAlign: 'center',
  },
  menuItemText: {
    fontSize: 17,
    color: '#fff',
    fontWeight: '500',
    fontStyle: 'italic',
    letterSpacing: 0.3,
  },
  logoutText: {
    color: '#FF3B30',
    fontWeight: '600',
  },
});

export default FloatingMenu;
