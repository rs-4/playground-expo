# ReminidersNotifications

## Description

ReminidersNotifications is a time-based reminder selection component. It allows users to choose when they want to receive notifications for reminders, with an animated and intuitive user interface.

## Features

- **Time Selection**: Choice of reminders with different predefined durations
- **Fluid Animations**: Smooth transitions between different component states
- **Intuitive Interface**: Clear organization of time options
- **Visual Feedback**: Animations when selecting options
- **Adaptability**: Adjusts to the light/dark theme of the application

## Usage

```tsx
import ReminidersNotifications from "@/components/playground/ReminidersNotifications";

export default function MyScreen() {
  const handleTimeSelection = (timeOption) => {
    // Process the selected time option
    console.log("Selected time:", timeOption);
  };

  return (
    <View style={{ flex: 1 }}>
      <ReminidersNotifications onSelectTime={handleTimeSelection} />
    </View>
  );
}
```

## Technologies Used

- **React Native Reanimated**: For performant animations
- **Expo Vector Icons**: For interface icons
- **Gesture Handler**: For fluid touch interactions

## Structure

The component is organized into different sections:
- A list of time options (15 min, 30 min, 1 hour, etc.)
- Visual effects to indicate active selection
- A confirmation animation when making a selection

## Customization

The component can be customized by adjusting:
- Available time options
- Button colors and styles
- Animations and their durations
- Option texts and descriptions 