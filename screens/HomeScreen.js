import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

export default function HomeScreen({ navigation }) {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [amWeight, setAmWeight] = useState('');
  const [pmWeight, setPmWeight] = useState('');
  const [note, setNote] = useState('');
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchWeights();
  }, []);

  const fetchWeights = async () => {
    try {
      const token = await SecureStore.getItemAsync('token');
      const response = await axios.get('http://192.168.1.169:5000/weights', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLogs(response.data);
    } catch (err) {
      console.error('Fetch weights error:', err);
      setError('Failed to load weights');
    }
  };

  const handleSave = async () => {
    try {
      const token = await SecureStore.getItemAsync('token');
      await axios.post(
        'http://192.168.1.169:5000/weights',
        { date, am_weight: parseFloat(amWeight) || null, pm_weight: parseFloat(pmWeight) || null, note },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAmWeight('');
      setPmWeight('');
      setNote('');
      setError('');
      fetchWeights(); // Refresh logs
    } catch (err) {
      console.error('Save weight error:', err);
      setError('Failed to save weight');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Weight Tracker</Text>
      <TextInput style={styles.input} placeholder="Date (YYYY-MM-DD)" value={date} onChangeText={setDate} />
      <TextInput style={styles.input} placeholder="AM Weight" value={amWeight} onChangeText={setAmWeight} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="PM Weight" value={pmWeight} onChangeText={setPmWeight} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Note" value={note} onChangeText={setNote} />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Button title="Save Weight" onPress={handleSave} />
      <FlatList
        data={logs}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.logItem}>
            <Text>{item.date}: AM {item.am_weight || '-'} | PM {item.pm_weight || '-'} | {item.note || 'No note'}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, textAlign: 'center', marginBottom: 20 },
  input: { borderWidth: 1, padding: 10, marginVertical: 5, borderRadius: 5 },
  error: { color: 'red', textAlign: 'center', marginVertical: 10 },
  logItem: { padding: 10, borderBottomWidth: 1, borderColor: '#ccc' },
});