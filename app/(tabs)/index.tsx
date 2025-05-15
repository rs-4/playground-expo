import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { router } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useThemeColor } from "@/hooks/useThemeColor";

const HomePage = () => {
  const cardColor = useThemeColor({}, "card");

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.header}>Bienvenue</ThemedText>

      <Pressable onPress={() => router.push("../playground")}>
        <View style={[styles.card, { backgroundColor: cardColor }]}>
          <ThemedText style={styles.cardTitle}>Playground</ThemedText>
          <ThemedText style={styles.cardDescription}>
            Démonstration des composants personnalisés
          </ThemedText>
        </View>
      </Pressable>
    </ThemedView>
  );
};

export default HomePage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 24,
  },
  card: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 16,
    opacity: 0.7,
  },
});
