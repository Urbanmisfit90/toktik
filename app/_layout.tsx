// app/_layout.tsx
import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import { SplashScreen } from "expo-router";
import React from "react";
import { AuthProvider } from "./contexts/AuthContext";

export default function RootLayout() {
  // Example: loading fonts or other async tasks
  const [fontsLoaded] = useFonts({
    // If you have custom fonts in /assets/fonts
    // 'YourCustomFont': require('../assets/fonts/YourCustomFont.ttf'),
  });

  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        {/* By default, load the (tabs) layout. */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        {/* If you have other top-level screens, you can add them here */}
      </Stack>
    </AuthProvider>
  );
}
