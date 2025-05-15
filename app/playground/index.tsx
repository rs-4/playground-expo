import React from 'react';
import { View, Pressable, SafeAreaView, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';

type PlaygroundItem = {
  title: string;
  icon: string;
  route: string;
  description: string;
  color: [string, string];
};

const PLAYGROUND_ITEMS: PlaygroundItem[] = [
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
];

export default function PlaygroundIndex() {
  const router = useRouter();
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');

  // Animation values for cards
  const scrollY = React.useRef(new Animated.Value(0)).current;

  const navigateTo = (route: string) => {
    router.push(`/playground/${route}` as any);
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor }}>
      <StatusBar style="auto" />
      <ThemedView className="flex-1 px-3">
        <View className="mb-4 pt-5">
          <ThemedText className="pt-6 text-[38px] font-extrabold tracking-tighter">
            Playground
          </ThemedText>
          <ThemedText className="mt-[5px] text-lg opacity-70">Composants interactifs</ThemedText>
        </View>

        <Animated.ScrollView
          className="-mx-3 flex-1 px-3"
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
                style={{
                  transform: [{ scale }],
                  opacity,
                }}>
                <Pressable
                  onPress={() => navigateTo(item.route)}
                  className="mb-[10px] flex-col rounded-[14px] shadow-lg shadow-black/10"
                  style={({ pressed }) => [
                    {
                      opacity: pressed ? 0.8 : 1,
                      transform: [{ scale: pressed ? 0.98 : 1 }],
                    },
                  ]}>
                  <LinearGradient
                    colors={item.color}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    className="overflow-hidden rounded-[14px]">
                    <View className="flex-row items-center p-[14px]">
                      <View className="mr-[14px] aspect-square items-center justify-center rounded-[12px] bg-white/20 p-2">
                        <Ionicons name={item.icon as any} size={32} color="#ffffff" />
                      </View>
                      <View className="flex-1 justify-center">
                        <ThemedText className="mb-1 text-base font-bold text-white">
                          {item.title}
                        </ThemedText>
                        <ThemedText className="text-[13px] text-white/90">
                          {item.description}
                        </ThemedText>
                      </View>
                      <View className="items-center justify-center rounded-[16px] bg-white/20 p-[6px]">
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
    </SafeAreaView>
  );
}
