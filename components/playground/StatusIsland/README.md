# Status Island Component

A React Native component that mimics iOS-style dropdown notifications from the top, with success and error states.

## Features

- Animated expanding notification that extends downward
- Success and error states with appropriate icons
- Auto-dismissing with tap-to-dismiss functionality
- Responsive design that adapts to different screen sizes
- Context-based usage through a custom hook
- Optional message text

## Installation

No additional installation required if you're already using this codebase. The component uses:
- `react-native-reanimated` for animations
- `@expo/vector-icons` for the status icons

## Usage

### Basic Usage

The component is designed to be used through a hook called `useStatusIsland`:

```tsx
import { useStatusIsland } from '@/components/playground/StatusIsland/context';

function MyComponent() {
  const { success, error } = useStatusIsland();
  
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.successButton}
        onPress={() => success("Operation completed successfully!")}>
        <Text style={styles.buttonText}>Show Success</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={styles.errorButton}
        onPress={() => error("Something went wrong!")}>
        <Text style={styles.buttonText}>Show Error</Text>
      </TouchableOpacity>
    </View>
  );
}
```

The hook provides two methods:
- `success(message?)` - Shows a success notification with optional message
- `error(message?)` - Shows an error notification with optional message

### Setting up the Provider

To use the hook, you need to wrap your application with the StatusIslandProvider component in your `_layout.tsx` file:

```tsx
// app/_layout.tsx
import React from 'react';
import { StatusIslandProvider } from '@/components/playground/StatusIsland/context';

export default function RootLayout({ children }) {
  return (
    <StatusIslandProvider>
      {children}
    </StatusIslandProvider>
  );
}
```

## API Reference

### useStatusIsland Hook

The `useStatusIsland` hook provides:

| Method | Type | Description |
|------|------|-------------|
| `success` | (message?: string) => void | Function to display a success notification with an optional message |
| `error` | (message?: string) => void | Function to display an error notification with an optional message |

### StatusIslandProvider Props

| Prop | Type | Description |
|------|------|-------------|
| `children` | ReactNode | The child components to be wrapped with the provider |

## Customization

You can customize the appearance and behavior of the Status Island by modifying the constants at the top of the component file:

```tsx
// Base values for responsive dimension calculations
const BASE_STATUS_ISLAND_HEIGHT = 38;          // Default island height
const BASE_STATUS_ISLAND_MIN_WIDTH = 126;      // Minimum width when collapsed
const BASE_STATUS_ISLAND_MAX_WIDTH = 200;      // Maximum width when expanded
const BASE_STATUS_ISLAND_EXPANDED_HEIGHT = 150; // Height when expanded
const ANIMATION_DURATION = 350;                // Duration of animations in ms
```

### Success and Error Styles

The component uses different colors for success and error states:

```tsx
// Success
{
  name: 'checkmark-circle-outline',
  color: '#4CD964',
  backgroundColor: 'rgba(76, 217, 100, 0.1)'
}

// Error
{
  name: 'close-circle-outline',
  color: '#FF3B30',
  backgroundColor: 'rgba(255, 59, 48, 0.1)'
}
```

## Differences from DynamicIslandNotifications

Unlike the DynamicIslandNotifications component, StatusIsland:
- Expands downward instead of sideways
- Doesn't require StatusBar manipulation
- Provides separate success and error states with appropriate icons
- Has a more compact and focused design

## Contributing

Feel free to modify this component to fit your specific needs. Some potential enhancements:
- Add more status types (warning, info, etc.)
- Add support for custom icons
- Add support for actions or buttons within the notification
- Customize animation timing and behavior 