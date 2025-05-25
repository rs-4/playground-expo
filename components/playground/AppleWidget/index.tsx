import React, { useState, useRef, useEffect } from 'react';
import { View, Dimensions, TouchableOpacity, ImageBackground, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  interpolate,
  useAnimatedScrollHandler,
  runOnJS,
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { ThemedView } from '@/components/ThemedView';

const { width: screenWidth } = Dimensions.get('window');
const CARD_HEIGHT = 200;

interface AppleWidgetItem {
  id: string;
  title: string;
  subtitle?: string;
  background: string;
  content?: React.ReactNode;
}

interface AppleWidgetProps {
  items: AppleWidgetItem[];
}

export default function AppleWidget({ items }: AppleWidgetProps) {
  const scrollViewRef = useRef<Animated.ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollY = useSharedValue(0);

  // Triple items for infinite scroll
  const infiniteItems = [...items, ...items, ...items];
  const middleIndex = items.length;

  useEffect(() => {
    // Start in the middle for infinite effect
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({
        y: middleIndex * CARD_HEIGHT,
        animated: false,
      });
    }, 100);
  }, [middleIndex]);

  const updateCurrentIndex = (index: number) => {
    setCurrentIndex(index % items.length);
  };

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const onMomentumScrollEnd = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / CARD_HEIGHT);

    // Reset position for infinite scroll
    if (index <= 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({
          y: (items.length * 2 - 1) * CARD_HEIGHT,
          animated: false,
        });
      }, 50);
      updateCurrentIndex(items.length - 1);
    } else if (index >= infiniteItems.length - 1) {
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({
          y: items.length * CARD_HEIGHT,
          animated: false,
        });
      }, 50);
      updateCurrentIndex(0);
    } else {
      updateCurrentIndex(index);
    }
  };

  const scrollToIndex = (targetIndex: number) => {
    const currentScrollIndex = Math.round(scrollY.value / CARD_HEIGHT);
    const currentRealIndex = currentScrollIndex % items.length;

    let scrollIndex = currentScrollIndex;

    if (targetIndex !== currentRealIndex) {
      // Find the closest path to target
      const diff = targetIndex - currentRealIndex;
      if (Math.abs(diff) <= items.length / 2) {
        scrollIndex = currentScrollIndex + diff;
      } else {
        scrollIndex = currentScrollIndex + (diff > 0 ? diff - items.length : diff + items.length);
      }

      scrollViewRef.current?.scrollTo({
        y: scrollIndex * CARD_HEIGHT,
        animated: true,
      });
    }
  };

  const renderItem = (item: AppleWidgetItem, index: number) => {
    const animatedStyle = useAnimatedStyle(() => {
      const inputRange = [
        (index - 1) * CARD_HEIGHT,
        index * CARD_HEIGHT,
        (index + 1) * CARD_HEIGHT,
      ];

      return {
        transform: [
          {
            scale: interpolate(scrollY.value, inputRange, [0.8, 1, 0.8], 'clamp'),
          },
        ],
        opacity: interpolate(scrollY.value, inputRange, [0, 1, 0], 'clamp'),
      };
    });

    const backgroundAnimatedStyle = useAnimatedStyle(() => {
      const inputRange = [
        (index - 1) * CARD_HEIGHT,
        index * CARD_HEIGHT,
        (index + 1) * CARD_HEIGHT,
      ];

      return {
        transform: [
          {
            translateY: interpolate(scrollY.value, inputRange, [-15, 0, 15], 'clamp'),
          },
        ],
      };
    });

    return (
      <Animated.View
        key={`${item.id}-${index}`}
        className="h-[200px] w-full justify-center items-center  "
        style={animatedStyle}>
        <View className="flex-1 w-full rounded-[20px] overflow-hidden shadow-2xl border-[0.5px] border-white/10">
          <Animated.View className="absolute inset-0" style={backgroundAnimatedStyle}>
            <ImageBackground
              source={{ uri: item.background }}
              className="flex-1 w-full h-full"
              imageStyle={{ borderRadius: 20 }}>
              <View className="absolute inset-0 bg-black/20 rounded-[20px]" />
            </ImageBackground>
          </Animated.View>

          <View className="flex-1 p-6 justify-end z-10">
            {item.content || (
              <>
                <Text className="text-2xl font-bold text-white mb-1.5 drop-shadow-lg">
                  {item.title}
                </Text>
                {item.subtitle && (
                  <Text className="text-base text-white/90 font-medium drop-shadow-md">
                    {item.subtitle}
                  </Text>
                )}
              </>
            )}
          </View>
        </View>
      </Animated.View>
    );
  };

  const renderDots = () => (
    <View className="flex-col items-center justify-center w-2 gap-1">
      {items.map((_, index) => {
        const animatedDotStyle = useAnimatedStyle(() => {
          // Calculate current index based on scroll position
          const currentScrollIndex = scrollY.value / CARD_HEIGHT;
          const currentRealIndex =
            ((currentScrollIndex % items.length) + items.length) % items.length;

          // Distance from current position
          const distance = Math.abs(index - currentRealIndex);
          const adjustedDistance = Math.min(distance, items.length - distance);

          return {
            transform: [
              {
                scale: interpolate(adjustedDistance, [0, 1], [1.4, 0.8], 'clamp'),
              },
            ],
            opacity: interpolate(adjustedDistance, [0, 1], [1, 0.4], 'clamp'),
            backgroundColor: '#ffffff',
          };
        });

        return (
          <TouchableOpacity key={index} onPress={() => scrollToIndex(index)} className="p-1.5">
            <Animated.View className="w-2 h-2 rounded-full" style={animatedDotStyle} />
          </TouchableOpacity>
        );
      })}
    </View>
  );

  return (
    <ThemedView className="h-[200px]">
      <View className="flex-row flex-1 bg-[#121212]">
        <View className="flex-1 mr-4 rounded-[20px]  shadow-2xl border-t border-white/10 overflow-hidden">
          {/* Subtle blur effect at top */}
          <BlurView
            intensity={5}
            className="absolute top-0 left-0 right-0 h-5 rounded-t-[20px] z-10 opacity-70"
            tint="dark"
          />

          <Animated.ScrollView
            ref={scrollViewRef}
            className="bg-stone-900"
            showsVerticalScrollIndicator={false}
            pagingEnabled={true}
            decelerationRate="fast"
            snapToInterval={CARD_HEIGHT}
            snapToAlignment="center"
            contentContainerStyle={{ flexGrow: 1, alignItems: 'stretch', justifyContent: 'center' }}
            onScroll={scrollHandler}
            onMomentumScrollEnd={onMomentumScrollEnd}
            scrollEventThrottle={16}>
            {infiniteItems.map((item, index) => renderItem(item, index))}
          </Animated.ScrollView>
        </View>

        {renderDots()}
      </View>
    </ThemedView>
  );
}
