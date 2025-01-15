// app/(tabs)/_layout.tsx
import { Tabs } from "expo-router";
import { View } from "react-native";
import React from "react";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "#000",
        },
      }}
    >
      {/* 
        By default, every .tsx file in this folder (except _layout & +not-found)
        becomes a separate tab. Example:
          - index.tsx -> routeName "index"
          - explore.tsx -> routeName "explore"
          - ...
      */}
    </Tabs>
  );
}
