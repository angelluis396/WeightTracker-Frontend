import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export default function HomeScreen({ navigation }) {
  const [averages, setAverages] = useState({ todayAvg: null, yesterdayAvg: null, previousWeekAvg: null });
  const [entry, setEntry] = useState({ am_weight: null, pm_weight: null });
  const [isNumberPadDisabled, setIsNumberPadDisabled] = useState(false);
  const [isNoteModalVisible, setIsNoteModalVisible] = useState(false);

  // Placeholder functions (replace with your actual logic)
  const handleNumberPress = (key) => { console.log(`${key} pressed`); };
  const handleWeightSave = (period) => { console.log(`${period} weight saved`); };

  const numberPadOrder = [
    '7', '8', '9', '📓1', // Notebook 1
    '4', '5', '6', '📓2', // Notebook 2
    '1', '2', '3', '🔒',  // Lock
    '0', '.', 'AM', 'PM'
  ];

  return (
    <View style={styles.container}>
      {/* Averages Display */}
      <View style={styles.displayContainer}>
        <Text style={styles.displayText}>Weight Entry</Text>
        <View style={styles.averagesContainer}>
          <Text style={styles.averageText}>
            Today: {averages.todayAvg !== null ? averages.todayAvg : 'N/A'}
          </Text>
          <Text style={styles.averageText}>
            Yesterday: {averages.yesterdayAvg !== null ? averages.yesterdayAvg : 'N/A'}
          </Text>
          <Text style={styles.averageText}>
            Last Week: {averages.previousWeekAvg !== null ? averages.previousWeekAvg : 'N/A'}
          </Text>
        </View>
      </View>

      {/* Calculator Grid */}
      <View style={styles.numberPad}>
        {numberPadOrder.map((key, index) => {
          const isNotebook1 = key === '📓1';
          const isNotebook2 = key === '📓2';
          const isLock = key === '🔒';
          const isAMButton = key === 'AM';
          const isPMButton = key === 'PM';
          const isDisabled = isNumberPadDisabled || (isAMButton && entry?.am_weight) || (isPMButton && entry?.pm_weight);
          return (
            <TouchableOpacity
              key={index}
              style={[styles.numberButton, isDisabled && { opacity: 0.5 }]}
              onPress={() => {
                if (isDisabled) return;
                if (isNotebook1 || isNotebook2) setIsNoteModalVisible(true);
                else if (isLock) console.log('Lock pressed');
                else if (isAMButton) handleWeightSave('AM');
                else if (isPMButton) handleWeightSave('PM');
                else handleNumberPress(key);
              }}
              disabled={isDisabled}
            >
              <Text style={styles.numberText}>{key}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = {
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' },
  displayContainer: { alignItems: 'center', marginBottom: 20 },
  displayText: { fontSize: 24, color: '#fff' },
  averagesContainer: { marginTop: 10 },
  averageText: { fontSize: 16, color: '#ccc' },
  numberPad: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', width: '80%' },
  numberButton: { width: '22%', aspectRatio: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#333', borderRadius: 10, margin: 5 },
  numberText: { fontSize: 20, color: '#fff' },
};