import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  GestureResponderEvent,
  Animated,
  Pressable,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";

interface DarkGradientButtonProps {
  title?: string;
  onPress: (event: GestureResponderEvent) => void;
}

const DarkGradientButton = ({
  title = "Get started",
  onPress,
}: DarkGradientButtonProps) => {
  const [animation] = useState(new Animated.Value(0));

  const handlePressIn = () => {
    Animated.timing(animation, {
      toValue: 1,
      duration: 150,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.timing(animation, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start();
  };

  const buttonScale = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.96],
  });

  const buttonOpacity = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.8],
  });

  const animatedStyle = {
    transform: [{ scale: buttonScale }],
    opacity: buttonOpacity,
  };

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.pressable}
      >
        <LinearGradient
          colors={["#34c759", "#2ecc71"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.button}
        >
          <View style={styles.innerShadow} />

          <View style={styles.content}>
            <Text style={styles.text}>{title}</Text>
            <Feather
              name="arrow-right"
              size={16}
              color="#FFFFFF"
              style={styles.icon}
            />
          </View>
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  pressable: {
    borderRadius: 15,
    overflow: "hidden",
    paddingTop: 32,
  },
  button: {
    borderRadius: 15,
    paddingVertical: 14,
    paddingHorizontal: 24,
    overflow: "hidden",
    position: "relative",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  innerShadow: {
    position: "absolute",
    top: 1.85,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    borderRadius: 15,
    zIndex: 0,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  text: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 16,
    marginRight: 8,
  },
  icon: {
    marginTop: 1,
  },
});

export default DarkGradientButton;
