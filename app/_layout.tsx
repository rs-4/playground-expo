import '../global.css';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Redirect, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { useStatusBarStore } from '@/components/playground/DynamicNotifications/store/useStatusBarStore';

import { useColorScheme } from '@/hooks/useColorScheme';
import { DynamicIslandProvider } from '@/components/playground/DynamicNotifications/context';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { hidden } = useStatusBarStore.getState();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <DynamicIslandProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="playground" />

          <Stack.Screen name="+not-found" />
        </Stack>
      </DynamicIslandProvider>
      <StatusBar style="auto" hidden={hidden} />
    </ThemeProvider>
  );
}
