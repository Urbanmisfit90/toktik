import React, { useState } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import styled from 'styled-components/native';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // This is from Expo Router
  const router = useRouter();

  const handleLogin = () => {
    // For demonstration purposes, we’ll just do a basic check.
    if (username.trim() && password.trim()) {
      // Navigate to /home route
      router.push('/home');
    } else {
      Alert.alert('Invalid Credentials', 'Please enter both username and password.');
    }
  };

  return (
    <Container>
      <Title>Welcome to TokTik</Title>

      <Input
        value={username}
        onChangeText={setUsername}
        placeholder="Username"
        autoCapitalize="none"
        autoCorrect={false}
      />
      <Input
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
      />

      <Button onPress={handleLogin}>
        <ButtonText>Login</ButtonText>
      </Button>
    </Container>
  );
}

// ---- STYLED COMPONENTS ---- //

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 24px;
  background-color: #f5f5f5;
`;

const Title = styled.Text`
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 40px;
  color: #333;
`;

const Input = styled.TextInput`
  width: 100%;
  height: 50px;
  margin-bottom: 20px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 16px;
  background-color: #fff;
`;

const Button = styled.TouchableOpacity`
  width: 100%;
  height: 50px;
  background-color: #1E90FF;
  border-radius: 8px;
  justify-content: center;
  align-items: center;
`;

const ButtonText = styled.Text`
  color: #fff;
  font-size: 18px;
  font-weight: 600;
`;
