import React from 'react';
import { View, Pressable, SafeAreaView, Animated, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useStatusBarStore } from '@/components/playground/DynamicNotifications/store/useStatusBarStore';
import { DynamicIslandProvider } from '@/components/playground/DynamicNotifications/context';

type PlaygroundItem = {
  title: string;
  icon: string;
  route: string;
  description: string;
  color: [string, string];
};

const PLAYGROUND_ITEMS: PlaygroundItem[] = [
  {
    title: 'Apple Widget',
    icon: 'albums-outline',
    route: 'AppleWidget',
    description: 'Carousel rectangulaire avec effet parallax',
    color: ['#667eea', '#764ba2'],
  },
  {
    title: 'Plus Menu',
    icon: 'add-circle-outline',
    route: 'PlusMenu',
    description: 'Floating menu with animated options',
    color: ['#4facfe', '#00f2fe'],
  },
  {
    title: 'Reminders Notifications',
    icon: 'notifications-outline',
    route: 'ReminidersNotifications',
    description: 'Time-based reminder selection',
    color: ['#6a11cb', '#2575fc'],
  },
  {
    title: 'Header Menu',
    icon: 'menu-outline',
    route: 'HeaderMenu',
    description: 'Header menu with animated options',
    color: ['#fa709a', '#fee140'],
  },
  {
    title: 'Dynamic Island Reload',
    icon: 'reload-circle-outline',
    route: 'DynamicNotifications',
    description: 'Dynamic Island reload with animated options',
    color: ['#fa709a', '#fee140'],
  },
  {
    title: 'Status Island',
    icon: 'checkmark-circle-outline',
    route: 'StatusIsland',
    description: 'Status island with animated options',
    color: ['#fa709a', '#fee140'],
  },
];

export default function PlaygroundIndex() {
  const router = useRouter();
  const backgroundColor = useThemeColor({}, 'background');

  const scrollY = React.useRef(new Animated.Value(0)).current;
  const { hidden } = useStatusBarStore.getState();

  const navigateTo = (route: string) => {
    try {
      router.push(`/playground/${route}` as any);
    } catch (error) {
      console.warn('Navigation error:', error);
    }
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor }}>
      <DynamicIslandProvider>
        <StatusBar style="auto" hidden={hidden} />
        <ThemedView className="flex-1 px-3">
          <View className="mb-4 pt-5">
            <Text className="pt-6 text-h1 font-extrabold tracking-tight dark:text-white">
              Playground
            </Text>
            <Text className="text-h5 opacity-70 mt-1 dark:text-white">Interactive components</Text>
          </View>

          <Animated.ScrollView
            className="flex-1 -mx-3 px-3"
            contentContainerStyle={{ paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}
            onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
              useNativeDriver: true,
            })}
            scrollEventThrottle={16}>
            {PLAYGROUND_ITEMS.map((item, index) => {
              // Animation based on a standard offset to avoid circular references
              const itemOffset = 100 * index;
              const nextItemOffset = 100 * (index + 2);

              const inputRange = [-1, 0, itemOffset, nextItemOffset];

              const scale = scrollY.interpolate({
                inputRange,
                outputRange: [1, 1, 1, 0.9],
                extrapolate: 'clamp',
              });

              const opacity = scrollY.interpolate({
                inputRange,
                outputRange: [1, 1, 1, 0.5],
                extrapolate: 'clamp',
              });

              return (
                <Animated.View
                  key={index}
                  className="shadow-lg shadow-black/12 rounded-xl mb-2.5 flex-col "
                  style={{
                    transform: [{ scale }],
                    opacity,
                  }}>
                  <Pressable
                    onPress={() => navigateTo(item.route)}
                    className="shadow-black shadow-lg rounded-[14px] mb-2.5"
                    style={({ pressed }) => ({
                      opacity: pressed ? 0.8 : 1,
                      transform: [{ scale: pressed ? 0.98 : 1 }],
                    })}>
                    <LinearGradient
                      colors={item.color}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={{ borderRadius: 14 }}
                      className="rounded-[14px] overflow-hidden py-4">
                      <View className="flex-row items-center p-3.5 rounded-2xl">
                        <View className="aspect-square rounded-xl bg-white/20 justify-center items-center mr-3.5 p-2">
                          <Ionicons name={item.icon as any} size={32} color="#ffffff" />
                        </View>
                        <View className="flex-1 justify-center">
                          <Text className="text-base font-bold mb-1 text-white">{item.title}</Text>
                          <Text className="text-sm text-white/90">{item.description}</Text>
                        </View>
                        <View className="rounded-2xl bg-white/20 justify-center items-center p-1.5">
                          <Ionicons name="chevron-forward" size={20} color="#ffffff" />
                        </View>
                      </View>
                    </LinearGradient>
                  </Pressable>
                </Animated.View>
              );
            })}
          </Animated.ScrollView>
        </ThemedView>
      </DynamicIslandProvider>
    </SafeAreaView>
  );
}
