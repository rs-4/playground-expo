# Dynamic Island Notification Component

A React Native component that mimics the iOS Dynamic Island notification style for cross-platform mobile applications.


## Features

- Animated expanding/collapsing notification like iOS Dynamic Island
- Customizable animation parameters
- Auto-dismissing with tap-to-dismiss functionality
- Responsive design that adapts to different screen sizes
- Context-based usage through a custom hook

## Warning 

⚠️ **IMPORTANT**: You must replace all `<StatusBar>` components in your application with the store-connected version for the component to work properly. If you don't modify all StatusBar instances, the status bar icons may remain visible while Dynamic Island notifications are displayed, which will negatively impact the user experience.

```tsx
// ALWAYS use this format for StatusBar throughout your application
import { StatusBar } from 'react-native';
import { useStatusBarStore } from '@/components/playground/DynamicNotifications/store/useStatusBarStore';

function MyScreen() {
  const { hidden } = useStatusBarStore.getState();
  
  return (
    <>
      <StatusBar 
        translucent 
        backgroundColor="transparent" 
        hidden={hidden} // This prop is CRUCIAL
        barStyle="light-content" 
      />
      {/* Your screen content */}
    </>
  );
}
```

The `hidden={hidden}` prop is essential for the system to correctly hide the status bar icons when displaying notifications.

## Installation

No additional installation required if you're already using this codebase. The component uses:
- `react-native-reanimated` for animations
- `zustand` for state management

## Usage

### Basic Usage

The component is designed to be used through a hook called `useDynamicIsland`:

```tsx
import { useDynamicIsland } from '@/components/playground/DynamicNotifications/context';

function MyComponent() {
  const { showNotification } = useDynamicIsland();
  
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => showNotification('⭐ Hello user, how are you today?')}>
        <Text style={styles.text}>Show notification</Text>
      </TouchableOpacity>
    </View>
  );
}
```

The hook provides a `showNotification` function that you can call with a message string to display the notification.

### Implementation Details

The component uses a React Context to manage state and display notifications from anywhere in your app:

```tsx
// components/playground/DynamicNotifications/context/index.tsx
import React, { createContext, useContext, useState, useCallback } from 'react';
import DynamicIslandNotification from '../index';

type DynamicIslandContextType = {
  showNotification: (message: string) => void;
};

const DynamicIslandContext = createContext<DynamicIslandContextType | undefined>(undefined);

export const useDynamicIsland = () => {
  const context = useContext(DynamicIslandContext);
  if (!context) {
    throw new Error('useDynamicIsland must be used within a DynamicIslandProvider');
  }
  return context;
};

export const DynamicIslandProvider = ({ children }: { children: React.ReactNode }) => {
  const [message, setMessage] = useState('');
  const [visible, setVisible] = useState(false);

  const showNotification = useCallback((text: string) => {
    setMessage(text);
    setVisible(true);
  }, []);

  return (
    <DynamicIslandContext.Provider value={{ showNotification }}>
      {children}
      {visible && <DynamicIslandNotification message={message} onHide={() => setVisible(false)} />}
    </DynamicIslandContext.Provider>
  );
};
```

### Setting up the Provider

To use the hook, you need to wrap your application with the DynamicIslandProvider component in your `_layout.tsx` file:

```tsx
// app/_layout.tsx
import React from 'react';
import { DynamicIslandProvider } from '@/components/playground/DynamicNotifications/context';

export default function RootLayout({ children }) {
  return (
    <DynamicIslandProvider>
      {children}
    </DynamicIslandProvider>
  );
}
```

### Setting up the StatusBar Store

The component uses a Zustand store to manage the StatusBar visibility. This allows you to control the StatusBar visibility across your app when notifications appear.

1. First, make sure you have the store set up (it's already included in the component folder):

```tsx
// store/useStatusBarStore.ts
import { create } from 'zustand';

type StatusBarStore = {
  hidden: boolean;
  setHidden: (hidden: boolean) => void;
};

export const useStatusBarStore = create<StatusBarStore>((set) => ({
  hidden: false,
  setHidden: (hidden) => set({ hidden }),
}));
```

2. Update your _layout.tsx file to manage StatusBar visibility:

```tsx
// app/_layout.tsx
import React from 'react';
import { StatusBar } from 'react-native';
import { useStatusBarStore } from '@/components/playground/DynamicNotifications/store/useStatusBarStore';
import { DynamicIslandProvider } from '@/components/playground/DynamicNotifications/context';

export default function RootLayout({ children }) {
  const hidden = useStatusBarStore((state) => state.hidden);
  
  return (
    <DynamicIslandProvider>
      <StatusBar translucent backgroundColor="transparent" hidden={hidden} />
      {children}
    </DynamicIslandProvider>
  );
}
```

### Replacing Expo StatusBar with Store-connected StatusBar

Throughout your application, replace all instances of the Expo/React Native StatusBar component with the store-connected version:

```tsx
// Before
import { StatusBar } from 'expo-status-bar';

export default function MyScreen() {
  return (
    <>
      <StatusBar style="light" />
      {/* Your component content */}
    </>
  );
}

// After
import { StatusBar } from 'react-native';
import { useStatusBarStore } from '@/components/playground/DynamicNotifications/store/useStatusBarStore';

export default function MyScreen() {
  const hidden = useStatusBarStore((state) => state.hidden);
  
  return (
    <>
      <StatusBar translucent backgroundColor="transparent" hidden={hidden} style="light" />
      {/* Your component content */}
    </>
  );
}
```

## API Reference

### useDynamicIsland Hook

The `useDynamicIsland` hook provides:

| Method | Type | Description |
|------|------|-------------|
| `showNotification` | (message: string) => void | Function to display a notification with the given message |

### DynamicIslandProvider Props

| Prop | Type | Description |
|------|------|-------------|
| `children` | ReactNode | The child components to be wrapped with the provider |

## Customization

You can customize the appearance and behavior of the Dynamic Island notification by modifying the constants at the top of the component file:

```tsx
// Base values for responsive dimension calculations
const BASE_DYNAMIC_ISLAND_HEIGHT = 38;         // Default island height
const BASE_DYNAMIC_ISLAND_MIN_WIDTH = 126;     // Minimum width when collapsed
const BASE_DYNAMIC_ISLAND_MAX_WIDTH = 350;     // Maximum width when expanded
const BASE_DYNAMIC_ISLAND_EXPANDED_HEIGHT = 90; // Height when expanded
const ANIMATION_DURATION = 350;                // Duration of animations in ms
```

## Animation Timing

The component uses spring animations with customized parameters for a natural, bouncy feel. You can adjust these parameters to change the animation behavior:

```tsx
// For expansion animation
expansion.value = withSpring(1, {
  damping: 10,     // Moderate damping for natural bounce
  stiffness: 100,  // Moderate stiffness
  velocity: 3,     // Initial velocity for quick start
  mass: 0.7,       // Lighter mass for quicker movement
  overshootClamping: false, // Allow overshooting for bounce effect
  restDisplacementThreshold: 0.01,
  restSpeedThreshold: 2,
});
```

## Contributing

Feel free to modify this component to fit your specific needs. Some potential enhancements:
- Add support for different notification types (success, error, warning)
- Add an icon to the notification
- Support for actions buttons within the notification
- Custom durations for different notifications 