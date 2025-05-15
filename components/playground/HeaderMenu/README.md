# HeaderMenu

## Description

HeaderMenu is an elegant animated header with a dropdown user menu. It features a greeting message, a user icon button that transforms when clicked, and a smoothly expanding menu with animated items. The component provides rich visual feedback with parallax effects, scaling animations, and subtle blur transitions.

## Features

- **Expanding Header Animation**: Smooth transition when opening/closing the menu
- **3D Parallax Effect**: Menu items appear with a subtle 3D depth effect
- **Icon Transformation**: User icon transforms into a close button when menu is open
- **Spring-based Animations**: Natural-feeling animations using spring physics
- **Cascading Menu Items**: Sequential appearance of menu items for visual hierarchy
- **Content Scaling**: Optional scaling effect on content when menu is open
- **Customizable Greeting**: Personalized greeting with user name

## Usage

```tsx
import HeaderMenu from "@/components/playground/HeaderMenu";
import { menuItems } from "@/constants/MenuItem";

export default function MyScreen() {
  const handleMenuToggle = (isOpen: boolean) => {
    // Apply additional effects to your page content when menu opens/closes
    console.log("Menu is now:", isOpen ? "open" : "closed");
  };

  return (
    <View style={{ flex: 1 }}>
      <HeaderMenu
        greeting="Hello"
        userName="John"
        menuItems={menuItems}
        onMenuToggle={handleMenuToggle}
      />
      {/* Your content */}
    </View>
  );
}
```

## MenuItem Structure

Each menu item should follow this structure:

```typescript
interface MenuItem {
  icon: string; // Ionicons name
  label: string;
  onPress?: () => void;
  isLogout?: boolean; // Special styling for logout items
}
```

## Technologies Used

- **React Native Animated**: For high-performance fluid animations
- **Linear Gradient**: For attractive header background styling 
- **Safe Area Context**: For proper device-specific spacing
- **Gesture Handling**: For responsive touch interactions
- **Ionicons**: For consistent icon styling

## Customization

The component can be customized by modifying:
- Menu items (icons, labels, actions)
- Greeting message and user name
- Animation timing and easing functions
- Header gradient colors
- Menu item styling 
- Extra top padding for different device layouts 