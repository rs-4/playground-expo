import React from 'react';
import { View, StyleSheet, Pressable, SafeAreaView, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
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
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');

  // Animation values for cards
  const scrollY = React.useRef(new Animated.Value(0)).current;
  const { hidden } = useStatusBarStore.getState();
  const navigateTo = (route: string) => {
    router.push(`/playground/${route}` as any);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor }}>
      <DynamicIslandProvider>
        <StatusBar style="auto" hidden={hidden} />
        <ThemedView style={styles.container}>
          <View style={styles.headerContainer}>
            <ThemedText style={styles.header}>Playground</ThemedText>
            <ThemedText style={styles.subheader}>Interactive components</ThemedText>
          </View>

          <Animated.ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
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
                    style={({ pressed }) => [
                      styles.cardWrapper,
                      {
                        opacity: pressed ? 0.8 : 1,
                        transform: [{ scale: pressed ? 0.98 : 1 }],
                      },
                    ]}>
                    <LinearGradient
                      colors={item.color}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.card}>
                      <View style={styles.cardContent}>
                        <View style={styles.cardIcon}>
                          <Ionicons name={item.icon as any} size={32} color="#ffffff" />
                        </View>
                        <View style={styles.cardText}>
                          <ThemedText style={styles.title}>{item.title}</ThemedText>
                          <ThemedText style={styles.description}>{item.description}</ThemedText>
                        </View>
                        <View style={styles.arrowContainer}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 12,
  },
  headerContainer: {
    marginBottom: 15,
    paddingTop: 20,
  },
  header: {
    paddingTop: 24,
    fontSize: 38,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  subheader: {
    fontSize: 18,
    opacity: 0.7,
    marginTop: 5,
  },
  scrollView: {
    flex: 1,
    marginHorizontal: -12,
    paddingHorizontal: 12,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  cardWrapper: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
    borderRadius: 14,
    marginBottom: 10,
    flexDirection: 'column',
  },
  card: {
    borderRadius: 14,
    overflow: 'hidden',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
  },
  cardIcon: {
    aspectRatio: 1,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    padding: 8,
  },
  cardText: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
    color: '#ffffff',
  },
  description: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  arrowContainer: {
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 6,
  },
});
