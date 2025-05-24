import React from 'react';
import { StyleSheet, View, SafeAreaView } from 'react-native';
import { AppleWidget } from '@/components/playground/AppleWidget';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { StatusBar } from 'expo-status-bar';

export default function AppleWidgetDemo() {
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
      background: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop',
    },
    {
      id: '4',
      title: '🎵 Music Player',
      subtitle: 'Your personal playlist',
      background: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=400&fit=crop',
    },
    {
      id: '5',
      title: '🌤️ Weather Forecast',
      subtitle: 'Weekly predictions',
      background: 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=800&h=400&fit=crop',
    },
  ];

  return (
   
    <SafeAreaView style={styles.safeArea}> 
    <StatusBar style="light"/>
      <ThemedView style={styles.container}>
        <View style={styles.header}>
          <ThemedText style={styles.title}>Apple Widget Carousel</ThemedText>
          <ThemedText style={styles.description}>
            Scroll vertically to navigate through items
          </ThemedText>
        </View>

        <View style={styles.widgetContainer}>
          <AppleWidget items={sampleData} />
        </View>
        
        <View style={styles.footer}>
          <ThemedText style={styles.instructionText}>
            💡 Infinite scroll - Tap indicators to jump
          </ThemedText>
        </View>
      </ThemedView>
    </SafeAreaView>
   
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#121212',
  },
  container: {
    flex: 1,
    backgroundColor: '#121212',
    paddingHorizontal: 20,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#ffffff',
  },
  description: {
    fontSize: 16,
    opacity: 0.7,
    color: '#ffffff',
  },
  widgetContainer: {
    marginVertical: 20,
  },
  footer: {
    paddingVertical: 20,
    marginTop: 'auto',
  },
  instructionText: {
    fontSize: 14,
    opacity: 0.6,
    textAlign: 'center',
    fontStyle: 'italic',
    color: '#ffffff',
  },
}); 