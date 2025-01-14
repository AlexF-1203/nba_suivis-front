import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { login } from '../api/api';

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login: authLogin } = useAuth();

  const handleLogin = async () => {
    try {
      const response = await login(email, password);
      console.log('Response:', response.data); // Pour déboguer
      if (response.data.data && response.data.data.token) {
        authLogin(response.data.data.user, response.data.data.token);
        navigation.replace('Favorites');
      } else {
        setError('Erreur de format de réponse');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Email ou mot de passe invalide');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Se connecter" onPress={handleLogin} />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Button
        title="Pas de compte ? S'inscrire"
        onPress={() => navigation.navigate('Signup')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
});

export default Login;
