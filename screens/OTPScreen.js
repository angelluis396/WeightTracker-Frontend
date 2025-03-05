import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

export default function OTPScreen({ navigation }) {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');

  const handleVerify = async () => {
    try {
      const token = await SecureStore.getItemAsync('token');
      const deviceId = await SecureStore.getItemAsync('deviceId');
      await axios.post(
        'http://192.168.1.169:5000/verify-otp',
        { otp, deviceId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigation.navigate('Home');
    } catch (err) {
      setError(err.response?.data?.error || 'Verification failed');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter OTP</Text>
      <Text style={styles.subtitle}>A code was sent to your email</Text>
      <TextInput
        style={styles.input}
        placeholder="OTP"
        value={otp}
        onChangeText={setOtp}
        keyboardType="numeric"
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Button title="Verify" onPress={handleVerify} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, textAlign: 'center', marginBottom: 10 },
  subtitle: { fontSize: 16, textAlign: 'center', marginBottom: 20 },
  input: { borderWidth: 1, padding: 10, marginVertical: 10, borderRadius: 5 },
  error: { color: 'red', textAlign: 'center', marginBottom: 10 },
});