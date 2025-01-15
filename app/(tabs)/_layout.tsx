import { Tabs } from "expo-router";
import React from "react";
import HomeFeedScreen from ".";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: { backgroundColor: "#000" },
      }}
    >
      <Tabs.Screen
        // the file name must match whatever the route expects, e.g., "index.tsx" or "home.tsx"
        // If your route is "index", name="index". If "home", name="home", etc.
        name="index" 
        options={{ title: "Home" }}
      />
      {/* other tabs */}
    </Tabs>
  );
}
