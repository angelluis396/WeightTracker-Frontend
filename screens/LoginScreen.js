import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import * as Device from 'expo-device';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const setDeviceId = async () => {
      const deviceId = Device.deviceName || `${Device.osName}-${Device.osVersion}`;
      await SecureStore.setItemAsync('deviceId', deviceId);
    };
    setDeviceId();
  }, []);

  const handleLogin = async () => {
    try {
      const token = await SecureStore.getItemAsync('token');
      const deviceId = await SecureStore.getItemAsync('deviceId');
      const response = await axios.post(
        'http://192.168.1.169:5000/login',
        { email, password },
        { headers: { 'x-device-id': deviceId } }
      );
      await SecureStore.setItemAsync('token', response.data.token);
      console.log('Logged in, token saved!');
      navigation.navigate('Home');
    } catch (err) {
      if (err.response?.data?.needsOtp) {
        navigation.navigate('OTPScreen');
      } else {
        setError(err.response?.data?.error || 'Login failed');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" />
      <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Button title="Login" onPress={handleLogin} />
      <Button title="Need an account? Sign up" onPress={() => navigation.navigate('Signup')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, textAlign: 'center', marginBottom: 20 },
  input: { borderWidth: 1, padding: 10, marginVertical: 10, borderRadius: 5 },
  error: { color: 'red', textAlign: 'center', marginBottom: 10 },
});