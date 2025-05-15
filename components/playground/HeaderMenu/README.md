# HeaderMenu

## Description

HeaderMenu is a header menu component with animated options. It provides an elegant user experience for navigating between different sections of the application, with smooth transitions and appealing visual effects.

## Features

- **Animated Dropdown Menu**: Smooth transition when opening and closing
- **Blur Effect**: Blurred background to highlight the menu
- **Intuitive Navigation**: Clear organization of menu options
- **Theme Support**: Adaptation to the application's light/dark mode
- **Haptic Feedback**: Tactile feedback during interactions

## Usage

```tsx
import HeaderMenu from "@/components/playground/HeaderMenu";

export default function MyScreen() {
  const handleMenuItemPress = (menuItem) => {
    // Process the selected menu item
    console.log("Selected menu:", menuItem);
  };

  return (
    <View style={{ flex: 1 }}>
      <HeaderMenu onMenuItemPress={handleMenuItemPress} />
      {/* Your content */}
    </View>
  );
}
```

## Technologies Used

- **React Native Reanimated**: For performant animations
- **Expo Blur**: For the background blur effect
- **Haptics**: For tactile feedback
- **Gesture Handler**: For fluid touch interactions

## Structure

The component includes:
- A header button that activates/deactivates the menu
- A dropdown panel with the list of options
- Animation effects for transitions
- A blur overlay for the background

## Customization

You can customize the component by modifying:
- The list of menu options
- Element icons and styles
- Animations and their durations
- Colors and themes
- Menu location and layout 