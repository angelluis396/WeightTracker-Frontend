import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { format } from 'date-fns';

export default function LogsScreen({ navigation }) {
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const token = await SecureStore.getItemAsync('token');
      const response = await axios.get('http://192.168.1.169:5000/weights', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLogs(response.data);
    } catch (err) {
      console.error('Fetch logs error:', err);
      setError('Failed to load logs');
    }
  };

  const renderLogEntry = ({ item }) => {
    const formattedDate = format(new Date(item.date), 'MMM dd');
    const amText = item.am_weight ? `AM: ${item.am_weight}` : '-';
    const pmText = item.pm_weight ? `PM: ${item.pm_weight}` : '-';
    const weightText = `${amText} | ${pmText}`;
    const avg = item.am_weight && item.pm_weight ? ((item.am_weight + item.pm_weight) / 2).toFixed(1) : item.am_weight || item.pm_weight || '-';
    const noteText = item.note ? `Note: ${item.note}` : 'Not note';

    return (
      <View style={styles.logItem}>
        <Text style={styles.logDate}>{formattedDate}</Text>
        <Text style={styles.logWeights}>{weightText}</Text>
        <Text style={styles.logAverage}>Avg: {avg}</Text>
        <Text style={styles.logNote}>{noteText}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Weight Logs</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <FlatList
        data={logs}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderLogEntry}
        ListEmptyComponent={<Text style={styles.empty}>No logs yet.</Text>}
        style={styles.logsList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#ffffff', textAlign: 'center', marginBottom: 20 },
  logsList: { flex: 1 },
  logItem: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#1e1e1e',
    borderRadius: 5,
  },
  logDate: { fontSize: 16, fontWeight: 'bold', color: '#ffffff' },
  logWeights: { fontSize: 14, color: '#cccccc' },
  logAverage: { fontSize: 14, color: '#cccccc' },
  logNote: { fontSize: 12, color: '#999999', marginTop: 2 },
  empty: { textAlign: 'center', color: '#999999', marginTop: 20 },
  error: { color: 'red', textAlign: 'center', marginBottom: 10 },
});