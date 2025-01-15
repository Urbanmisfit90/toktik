// app/+not-found.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function NotFoundScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>404: Not Found</Text>
      <Text style={styles.link} onPress={() => router.back()}>
        Go back
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    color: "#fff",
    fontSize: 24,
    marginBottom: 10,
  },
  link: {
    color: "#00adee",
    fontSize: 16,
    textDecorationLine: "underline",
  },
});
