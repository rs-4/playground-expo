# Reminders Notifications Component

![Demo](demo.gif)

## Overview

The Reminders Notifications component provides a modern, animated interface for users to configure daily time-based reminders. It features a grid of time slots with predefined options (Morning, Noon, Afternoon, Evening) and allows users to add custom reminder times.

## Features

- ✨ **Animated UI**: Built with React Native Reanimated for smooth transitions and effects
- 🔔 **Time Slot Selection**: Predefined time slots with intuitive selection
- ⏰ **Custom Times**: Ability to add personalized reminder times
- 📱 **Platform Adaptation**: Different Time Picker handling for iOS and Android
- 🌈 **Beautiful Gradient Buttons**: Modern gradient buttons with animated feedback

## Installation

Make sure you have the following dependencies installed:

```bash
npm install react-native-reanimated @react-native-community/datetimepicker expo-linear-gradient @expo/vector-icons
```

## Usage

### Basic Integration

Import and use the ReminidersNotifications component in your screen:

```jsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import ReminidersNotifications from '@/components/ReminidersNotifications';

const RemindersScreen = () => (
  <View style={styles.container}>
    <ReminidersNotifications />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f7',
  },
});

export default RemindersScreen;
```

### Route Configuration

To add this screen to your Expo Router application:

1. Create the component file at `components/ReminidersNotifications.tsx`
2. Set up the route in your `app/(tabs)/index.tsx` file
3. Configure your tab layout in `app/(tabs)/_layout.tsx`

## Component Structure

The component consists of:

- **ReminidersNotifications**: Main component that manages time slots and user interactions
- **DarkGradientButton**: Reusable gradient button component with press animation

## Props & Customization

The component accepts the following props:

| Prop             | Type       | Default                             | Description                            |
| ---------------- | ---------- | ----------------------------------- | -------------------------------------- |
| initialTimeSlots | TimeSlot[] | [Morning, Noon, Afternoon, Evening] | Predefined time slots                  |
| onTimesSelected  | Function   | undefined                           | Callback when user confirms selections |
| theme            | Object     | Light theme                         | Customization options for colors       |

## Technical Details

### Time Slot Management

The component maintains selected time slots in state:

```javascript
const [selectedHours, setSelectedHours] = useState<string[]>([]);
```

Time slots can be toggled by tapping, with visual feedback to indicate selection.

### Custom Time Selection

The component uses a platform-specific approach for time selection:

- On iOS: Custom modal with DateTimePicker in spinner mode
- On Android: Native DateTimePicker dialog

### Animations

The UI includes several animated elements:

- FadeInDown: Title and cards fade in from top
- SlideInRight: Time slots slide in from right with sequential delay
- Layout animations: Smooth transitions when items are added or removed

## License

MIT © [rs-4]
