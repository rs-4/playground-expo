# Floating Menu Component Documentation

## Overview

The floating menu is an interactive UI component that displays a main button (+) which, when pressed, reveals a set of animated options. This menu uses fluid animations with React Native Reanimated and haptic feedback for an enhanced user experience.

## Components

The floating menu system consists of two main components:

1. **PlusMenu**: The main component that contains the + button and handles opening/closing animations
2. **OptionButton**: The individual option buttons that appear when the menu is activated

## Dependencies Installation

Make sure you have the following dependencies installed:

```bash
npm install react-native-reanimated expo-blur expo-haptics @expo/vector-icons
```

## Usage

### Integrating PlusMenu

Import and place the PlusMenu component in your application:

```jsx
import PlusMenu from '@/components/PlusMenu';

export default function MyScreen() {
  return (
    <View style={{ flex: 1 }}>
      {/* Your screen content */}
      <PlusMenu />
    </View>
  );
}
```

### Customizing Options

The PlusMenu component uses OptionButton to display different actions. You can customize these actions by modifying the PlusMenu.tsx file:

```jsx
<OptionButton
  iconName="camera-outline"
  title="Pictures"
  description="Take a picture"
  translateY={offsets[0]}
  opacity={opacities[0]}
/>
```

## Features

- **Fluid Animations**: Uses React Native Reanimated for performant animations
- **Haptic Feedback**: Provides tactile feedback via expo-haptics when opening/closing the menu
- **Blur Effect**: Uses expo-blur to create a background blur effect (with fallback for Android)
- **Sequential Animation**: Buttons appear with a sequential delay for an attractive visual effect

## OptionButton API

| Prop        | Type                  | Description                           |
| ----------- | --------------------- | ------------------------------------- |
| iconName    | string                | Icon name from the Ionicons library   |
| title       | string                | Button title                          |
| description | string                | Action description                    |
| translateY  | SharedValue\<number\> | Animation value for vertical position |
| opacity     | SharedValue\<number\> | Animation value for opacity           |

## Advanced Haptic Feedback Usage

The menu uses the `hapticWithSequence` function which allows creating haptic feedback sequences:

```js
// Usage examples:
hapticWithSequence(['O']); // Heavy impact
hapticWithSequence(['o']); // Medium impact
hapticWithSequence(['.', 100, 'o', 100, 'O']); // Complex sequence
```
