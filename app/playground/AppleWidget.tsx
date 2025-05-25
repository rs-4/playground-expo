import React from 'react';
import { View, SafeAreaView, Text } from 'react-native';
import AppleWidget from '@/components/playground/AppleWidget';
import { ThemedView } from '@/components/ThemedView';
import { StatusBar } from 'expo-status-bar';

function AppleWidgetDemo() {
  const sampleData = [
    {
      id: '1',
      title: '📱 New Application',
      subtitle: 'Discover the latest features',
      background: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=400&fit=crop',
    },
    {
      id: '2',
      title: '⚡ System Update',
      subtitle: 'Improved performance & security',
      background: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=400&fit=crop',
    },
    {
      id: '3',
      title: '📸 Photos of the Day',
      subtitle: 'Your favorite memories',
      background:
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop',
    },
    {
      id: '4',
      title: '🎵 Music Player',
      subtitle: 'Your personal playlist',
      background:
        'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=400&fit=crop',
    },
    {
      id: '5',
      title: '🌤️ Weather Forecast',
      subtitle: 'Weekly predictions',
      background:
        'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=800&h=400&fit=crop',
    },
    {
      id: '6',
      title: '🌤️ Weather Forecast',
      subtitle: 'Weekly predictions',
      background:
        'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=800&h=400&fit=crop',
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-[#121212]">
      <StatusBar style="light" />
      <ThemedView className="flex-1 px-4" style={{ backgroundColor: '#121212' }}>
        <View className="pt-10 pb-10">
          <Text className="text-4xl font-bold text-white mb-2">Apple Widget Carousel</Text>
          <Text className="text-lg text-white/70">Scroll vertically to navigate through items</Text>
        </View>

        <View className="mt-10">
          <AppleWidget items={sampleData} />
        </View>

        <View className="py-10 mt-auto">
          <Text className="text-base text-white/70 text-center italic opacity-60">
            💡 Infinite scroll - Tap indicators to jump
          </Text>
        </View>
      </ThemedView>
    </SafeAreaView>
  );
}

export default AppleWidgetDemo;
