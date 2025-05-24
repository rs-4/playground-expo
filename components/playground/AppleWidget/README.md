# Apple Widget Carousel

A beautiful, Apple-inspired carousel component for React Native with infinite scroll, parallax effects, and smooth animations.

## ✨ Features

- **🔄 Infinite Scroll**: Seamless infinite scrolling in vertical direction
- **📱 Apple Design**: Clean, modern design inspired by Apple widgets
- **🎯 Single Card Focus**: Only the active card is visible at a time
- **⚡ Smooth Animations**: Fluid transitions with parallax effects
- **💡 Interactive Indicators**: Real-time reactive dots for navigation
- **🌓 Theme Support**: Automatic dark/light theme adaptation
- **📐 Responsive Layout**: Adapts to different screen sizes
- **👆 Touch Control**: Full touch control with snap-to-position

## 🚀 Installation

This component is part of the playground components. Make sure you have the required dependencies:

```bash
npm install react-native-reanimated react-native-gesture-handler
```

## 📋 Usage

### Basic Example

```tsx
import { AppleWidget } from '@/components/playground/AppleWidget';

const data = [
  {
    id: '1',
    title: '📱 New App',
    subtitle: 'Discover features',
    background: 'https://example.com/image1.jpg',
  },
  {
    id: '2',
    title: '⚡ Update',
    subtitle: 'Performance boost',
    background: 'https://example.com/image2.jpg',
  },
];

export default function MyScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center' }}>
      <AppleWidget items={data} />
    </View>
  );
}
```

### With Custom Content

```tsx
const customData = [
  {
    id: '1',
    title: '',
    subtitle: '',
    background: 'https://example.com/bg.jpg',
    content: (
      <View>
        <Text style={{ color: 'white', fontSize: 24 }}>🎵 Now Playing</Text>
        <Text style={{ color: 'white', fontSize: 18 }}>Song Title</Text>
        <Text style={{ color: 'white', opacity: 0.8 }}>Artist Name</Text>
      </View>
    ),
  },
];
```

## 🎛️ Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `AppleWidgetItem[]` | **Required** | Array of items to display |
| `autoPlay` | `boolean` | `false` | Enable automatic scrolling |
| `autoPlayInterval` | `number` | `3000` | Auto-scroll interval in milliseconds |

### AppleWidgetItem Interface

```tsx
interface AppleWidgetItem {
  id: string;                    // Unique identifier
  title: string;                 // Card title
  subtitle?: string;             // Optional subtitle
  background: string;            // Background image URL
  content?: React.ReactNode;     // Optional custom content
}
```

## 🎨 Customization

### Layout Structure

```
┌─────────────────────────────────┬───┐
│                                 │ ● │
│        Card Container           │ ● │ <- Dots
│       (Takes full width)        │ ● │
│                                 │ ● │
└─────────────────────────────────┴───┘
```

### Key Styling Properties

- **Container Height**: Fixed at `CARD_HEIGHT` (240px)
- **Card Width**: Takes full available width minus dots area
- **Dots Area**: Fixed 32px width on the right
- **Border Radius**: 20px for modern look
- **Shadow**: Elevated appearance with shadow

## ⚙️ Configuration

### Adjusting Card Height

```tsx
// In the component file
const CARD_HEIGHT = 240; // Change this value
```

### Modifying Animation Values

```tsx
// Scale animation range
const scale = interpolate(scrollY.value, inputRange, [0.8, 1, 0.8]);

// Opacity transition
const opacity = interpolate(scrollY.value, inputRange, [0, 1, 0]);
```

## 🎯 Animation Details

### Card Animations
- **Scale**: 0.8 → 1.0 → 0.8 (inactive → active → inactive)
- **Opacity**: 0 → 1 → 0 (only active card visible)
- **Parallax**: Background moves independently for depth

### Dot Animations
- **Scale**: 0.8 → 1.4 (inactive → active)
- **Opacity**: 0.3 → 1.0 (inactive → active)
- **Real-time**: Updates during scroll, not just on end

## 📱 Responsive Behavior

- Cards automatically adjust to available width
- Dots maintain fixed 32px width
- Minimum spacing maintained between elements
- Works on different screen sizes

## ⚡ Performance

- **Smooth 60fps**: Uses `react-native-reanimated` for native performance
- **Optimized scrolling**: Efficient infinite scroll implementation
- **Memory efficient**: Triple-buffer approach instead of massive arrays
- **Native driver**: All animations run on native thread

## 🐛 Troubleshooting

### Common Issues

1. **Cards not visible**: Ensure container has sufficient height
2. **Scroll not working**: Check if parent has proper flex layout
3. **Images not loading**: Verify image URLs are accessible
4. **Animations choppy**: Ensure reanimated is properly installed

### Performance Tips

1. Use optimized image sizes (800x400 recommended)
2. Limit number of items for better performance
3. Use `FastImage` for better image caching
4. Avoid complex custom content in cards

## 🔗 Dependencies

- `react-native-reanimated`: For smooth animations
- `react-native-gesture-handler`: For touch handling
- Custom themed components (`ThemedView`, `ThemedText`)

## 📄 License

Part of the playground components collection.

---

**Made with ❤️ for React Native** 