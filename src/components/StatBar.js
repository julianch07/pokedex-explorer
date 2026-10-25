import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { STAT_NAMES_ES } from '../constants/theme';

/**
 * Concept: base stat with a bar whose width is proportional to the value
 * (the maximum possible value is 255).
 */
export default function StatBar({ statName, baseStat }) {
  // Proportion over 255
  const percentage = Math.min(100, Math.round((baseStat / 255) * 100));
  const displayName = STAT_NAMES_ES[statName] || statName;

  // Bar color by value: low / medium / high
  let barColor = '#EF4444';
  if (baseStat >= 90) barColor = '#10B981';
  else if (baseStat >= 60) barColor = '#F59E0B';

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={styles.name}>{displayName}</Text>
        <Text style={styles.value}>{baseStat}</Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${percentage}%`, backgroundColor: barColor }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  name: {
    fontSize: 13,
    color: '#4B5563',
    fontWeight: '500',
  },
  value: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#111827',
  },
  track: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 4,
  },
});
