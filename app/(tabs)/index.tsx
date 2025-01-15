// app/(tabs)/login.tsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useAuth } from "../contexts/AuthContext";

export default function LoginScreen() {
  const { user, login, logout, MOCK_USERS } = useAuth();

  const handleLogin = (mockUserId: string) => {
    const chosen = MOCK_USERS.find((u) => u.id === mockUserId);
    if (chosen) {
      login(chosen);
    }
  };

  return (
    <View style={styles.container}>
      {user ? (
        <>
          <Text style={styles.title}>Logged in as {user.username}</Text>
          <TouchableOpacity onPress={logout} style={styles.button}>
            <Text style={styles.buttonText}>Log Out</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.title}>Choose a Mock User</Text>
          {MOCK_USERS.map((mockUser) => (
            <TouchableOpacity
              key={mockUser.id}
              style={styles.button}
              onPress={() => handleLogin(mockUser.id)}
            >
              <Text style={styles.buttonText}>{mockUser.username}</Text>
            </TouchableOpacity>
          ))}
        </>
      )}
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
  title: { fontSize: 20, color: "#fff", marginBottom: 16 },
  button: {
    backgroundColor: "#ff0050",
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
  },
  buttonText: {
    color: "#fff",
  },
});
