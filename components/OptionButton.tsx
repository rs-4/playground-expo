import React from "react";
import { View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Reanimated, {
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { ThemedText } from "@/components/ThemedText";

interface OptionButtonProps {
  iconName: React.ComponentProps<typeof Ionicons>["name"];
  title: string;
  description: string;
  translateY: SharedValue<number>;
  opacity: SharedValue<number>;
}

const OptionButton: React.FC<OptionButtonProps> = ({
  iconName,
  title,
  description,
  translateY,
  opacity,
}) => {
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return (
    <Reanimated.View style={[styles.button, animatedStyle]}>
      <View style={styles.textWrapper} pointerEvents="none">
        <ThemedText style={styles.title}>{title}</ThemedText>
        <ThemedText style={styles.description}>{description}</ThemedText>
      </View>

      <View style={styles.iconWrapper} pointerEvents="none">
        <Ionicons name={iconName} size={24} color="#000" />
      </View>
    </Reanimated.View>
  );
};

export default OptionButton;

const styles = StyleSheet.create({
  // full width container with no background, flex row
  button: {
    position: "absolute",
    left: 20,
    right: 20, // same margin as the FAB
    minHeight: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  textWrapper: {
    flexShrink: 1,
    marginRight: 12,
  },
  iconWrapper: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    color: "#333",
    fontSize: 18,
    fontWeight: "bold",
  },
  description: {
    color: "#666",
    fontSize: 14,
  },
});
