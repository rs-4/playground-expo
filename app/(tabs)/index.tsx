import React from "react";
import { View, StyleSheet } from "react-native";
import PlusMenu from "@/components/PlusMenu";

const HomePage = () => (
  <View style={styles.container}>
    <PlusMenu />
  </View>
);

export default HomePage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
});
