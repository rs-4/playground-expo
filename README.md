# React Native Component Playground 🎮

## Overview 🔍

This playground is a section of the application dedicated to demonstrating and testing custom React Native components. It serves as an interactive showcase for components that can be reused in other projects.

> **Note:** All components are fully compatible with Expo SDK 53.0 and later versions ✅
> Support typescript ✅

## Available Components ✨

Currently, the playground contains the following components:

1. **[PlusMenu](./components/playground/PlusMenu)** 🔘 - Floating menu with fluid animations and haptic feedback
2. **[Reminders Notifications](./components/playground/ReminidersNotifications)** ⏰ - Time-based reminder selection component with animated UI
3. **[Header Menu](./components/playground/HeaderMenu)** 📋 - Header menu with animated options

Each component is accessible through the playground's home page and has a dedicated demonstration page.

## Animations and Interactions 🚀

The playground highlights interactive components with fluid animations:

- **Smooth Transitions** 🌊 - Using React Native Reanimated for high-performance animations
- **Haptic Feedback** 📳 - Incorporating tactile feedback to enhance user experience
- **Visual Effects** ✨ - Using blur effects, gradients, and transitions to create an appealing visual experience
- **Gesture Interactions** 👆 - Support for touch gestures for natural interaction

## How to Add a New Component to the Playground 🛠️

To add a new component to the playground, follow these steps:

1. Create a new folder for your component in `components/playground/`
2. Implement your component
3. Create a demonstration page in `app/playground/ComponentName.tsx`
4. Add your component to the list in `app/playground/index.tsx`
5. Add a README.md in your component folder to document its functionality

### Example of adding to app/playground/index.tsx

```tsx
const PLAYGROUND_ITEMS: PlaygroundItem[] = [
  {
    title: 'Plus Menu',
    icon: 'add-circle-outline',
    route: 'PlusMenu',
    description: 'Floating menu with animated options',
    color: ['#4facfe', '#00f2fe'],
  },
  {
    title: 'New Component',
    icon: 'cube-outline',
    route: 'NewComponent',
    description: 'Description of the new component',
    color: ['#fa709a', '#fee140'],
  },
];
```

5. Update the layout in `app/playground/_layout.tsx` to include your new page:

```tsx
<Stack screenOptions={{ headerShown: false }}>
  <Stack.Screen name="index" />
  <Stack.Screen name="PlusMenu" />
  <Stack.Screen name="NewComponent" />
</Stack>
```

## Best Practices 💡

- Include interactive demonstrations of your components
- Clearly document functionality
- Ensure your components are well isolated and reusable
- Use animations and interactions that enhance user experience
