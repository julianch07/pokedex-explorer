import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TYPE_COLORS, TYPE_NAMES_ES } from '../constants/theme';

/**
 * Concept: badge for each type (fire, water, grass...) with its own color.
 */
export default function TypeBadge({ typeName }) {
  const color = TYPE_COLORS[typeName] || '#71717A';
  const label = TYPE_NAMES_ES[typeName] || typeName;

  return (
    <View style={[styles.badge, { backgroundColor: color }]}>
      <Text style={styles.text}>{label.toUpperCase()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 6,
    marginBottom: 6,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
});
