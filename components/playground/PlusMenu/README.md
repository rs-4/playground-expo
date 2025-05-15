# PlusMenu

## Description

PlusMenu is a floating menu component with fluid animations and haptic feedback. It displays a floating "+" button that, when clicked, transforms into an "×" and reveals multiple action options in a smooth animation.

## Features

- **Transformation Animation**: The "+" button transforms into an "×" when opening the menu
- **Options Animation**: Options appear with a ripple effect from bottom to top
- **Blur Effect**: Use of a background blur effect to highlight the menu
- **Haptic Feedback**: Tactile feedback when opening and closing the menu
- **Cross-platform Support**: Works on iOS and Android with platform-specific adaptations

## Usage

```tsx
import PlusMenu from "@/components/playground/PlusMenu";

export default function MyScreen() {
  return (
    <View style={{ flex: 1 }}>
      {/* Your content */}
      <PlusMenu />
    </View>
  );
}
```

## Technologies Used

- **React Native Reanimated**: For smooth and performant animations
- **Expo Blur**: For the background blur effect
- **Haptics**: For tactile feedback

## Structure

The component is built with different animated parts:
- A main button with two bars (horizontal and vertical) that form the "+" symbol
- Option buttons that appear with animation
- A blur overlay that appears in the background

## Customization

The component can be customized by modifying the following properties:
- Button colors and gradients
- Option icons and text
- Haptic feedback intensity
- Animation timing and curves 