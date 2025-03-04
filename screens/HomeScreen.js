import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, ScrollView } from 'react-native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { format } from 'date-fns';

export default function HomeScreen({ navigation }) {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [amWeight, setAmWeight] = useState('');
  const [pmWeight, setPmWeight] = useState('');
  const [note, setNote] = useState('');
  const [logs, setLogs] = useState([]);
  const [averages, setAverages] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    fetchWeights();
    fetchAverages();
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

  const fetchAverages = async () => {
    try {
      const token = await SecureStore.getItemAsync('token');
      const response = await axios.get('http://192.168.1.169:5000/averages', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAverages(response.data);
    } catch (err) {
      console.error('Fetch averages error:', err);
      setError('Failed to load averages');
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
      fetchWeights();
      fetchAverages();
    } catch (err) {
      console.error('Save weight error:', err);
      setError('Failed to save weight');
    }
  };

  const renderWeightEntry = ({ item }) => {
    const formattedDate = format(new Date(item.date), 'MMM dd');
    const amText = item.am_weight ? `AM: ${item.am_weight}` : null;
    const pmText = item.pm_weight ? `PM: ${item.pm_weight}` : null;
    const weightText = [amText, pmText].filter(Boolean).join(' | ') || 'No weights';
    const noteText = item.note ? `Note: ${item.note}` : null;

    return (
      <View style={styles.logItem}>
        <Text style={styles.logDate}>{formattedDate}</Text>
        <Text style={styles.logWeights}>{weightText}</Text>
        {noteText && <Text style={styles.logNote}>{noteText}</Text>}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Weight Tracker</Text>

      {/* Averages Section */}
      <ScrollView style={styles.averagesContainer}>
        <Text style={styles.sectionTitle}>Your Averages</Text>
        {averages.oneDayAvg && (
          <Text style={styles.average}>Today's Average: {averages.oneDayAvg} lbs</Text>
        )}
        {averages.twoDayAvg && (
          <Text style={styles.average}>2-Day Average: {averages.twoDayAvg} lbs</Text>
        )}
        {averages.threeDayAvg && (
          <Text style={styles.average}>3-Day Average: {averages.threeDayAvg} lbs</Text>
        )}
        {averages.fourDayAvg && (
          <Text style={styles.average}>4-Day Average: {averages.fourDayAvg} lbs</Text>
        )}
        {averages.fiveDayAvg && (
          <Text style={styles.average}>5-Day Average: {averages.fiveDayAvg} lbs</Text>
        )}
        {averages.sixDayAvg && (
          <Text style={styles.average}>6-Day Average: {averages.sixDayAvg} lbs</Text>
        )}
        {averages.oneWeekAvg && (
          <Text style={styles.average}>1-Week Average: {averages.oneWeekAvg} lbs</Text>
        )}
        {averages.oneMonthAvg && (
          <Text style={styles.average}>1-Month Average: {averages.oneMonthAvg} lbs</Text>
        )}
        {averages.threeMonthAvg && (
          <Text style={styles.average}>3-Month Average: {averages.threeMonthAvg} lbs</Text>
        )}
        {averages.oneYearAvg && (
          <Text style={styles.average}>1-Year Average: {averages.oneYearAvg} lbs</Text>
        )}
        {Object.keys(averages).every(key => !averages[key]) && (
          <Text style={styles.empty}>No averages available yet.</Text>
        )}
      </ScrollView>

      {/* Weight Logs Section */}
      <FlatList
        data={logs}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderWeightEntry}
        ListEmptyComponent={<Text style={styles.empty}>No weight entries yet.</Text>}
        style={styles.logsList}
      />

      {/* Add New Entry Section */}
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Add New Entry</Text>
        <TextInput
          style={styles.input}
          placeholder="Date (YYYY-MM-DD)"
          value={date}
          onChangeText={setDate}
        />
        <TextInput
          style={styles.input}
          placeholder="AM Weight"
          value={amWeight}
          onChangeText={setAmWeight}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="PM Weight"
          value={pmWeight}
          onChangeText={setPmWeight}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Note (optional)"
          value={note}
          onChangeText={setNote}
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Button title="Save Weight" onPress={handleSave} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  averagesContainer: { marginBottom: 20, maxHeight: 150 }, // Limit height for scrolling
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 10 },
  average: { fontSize: 16, color: '#333', marginVertical: 2 },
  logsList: { flex: 1, marginBottom: 20 },
  inputContainer: { borderTopWidth: 1, borderColor: '#ccc', paddingTop: 10 },
  inputLabel: { fontSize: 18, fontWeight: '600', marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#fff',
  },
  error: { color: 'red', textAlign: 'center', marginVertical: 10 },
  logItem: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
  },
  logDate: { fontSize: 16, fontWeight: 'bold' },
  logWeights: { fontSize: 14, color: '#333' },
  logNote: { fontSize: 12, color: '#666', marginTop: 2 },
  empty: { textAlign: 'center', color: '#666', marginTop: 20 },
});