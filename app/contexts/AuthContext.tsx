// app/context/AuthContext.tsx
import React, { createContext, useState, useContext } from "react";

// A mock user interface
interface User {
  id: string;
  username: string;
  avatar: string;
}

// The shape of the AuthContext's value
interface AuthContextValue {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

// Create the context (defaulting to null)
const AuthContext = createContext<AuthContextValue | null>(null);

// A couple of fake users to pick from
const MOCK_USERS: User[] = [
  {
    id: "1",
    username: "Alice",
    avatar: "https://randomuser.me/api/portraits/women/23.jpg",
  },
  {
    id: "2",
    username: "Bob",
    avatar: "https://randomuser.me/api/portraits/men/55.jpg",
  },
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // Fake login: receives a user object and sets it as the logged-in user
  const login = (mockedUser: User) => {
    setUser(mockedUser);
  };

  // Fake logout
  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// A convenience hook so we don't do useContext everywhere
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return { ...context, MOCK_USERS };
}
