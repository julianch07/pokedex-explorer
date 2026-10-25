import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

/**
 * Concept: Pokémon card for the 2-column grid.
 * Shows the image, the 3-digit number (#025) and the capitalized name.
 */
export default function PokemonCard({ item, onPress }) {
  // Concept: number with leading zeros -> String(id).padStart(3, '0')
  const formattedId = `#${String(item.id).padStart(3, '0')}`;

  // First letter in uppercase
  const capitalizedName = item.name.charAt(0).toUpperCase() + item.name.slice(1);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.imageBackground}>
        {/* Concept: remote Image needs explicit width and height */}
        <Image
          source={{ uri: item.imageUrl }}
          style={styles.image}
          resizeMode="contain"
        />
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.idText}>{formattedId}</Text>
        <Text style={styles.nameText} numberOfLines={1}>
          {capitalizedName}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    maxWidth: '50%',
    margin: 6,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  imageBackground: {
    width: '100%',
    height: 120,
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
  },
  infoContainer: {
    width: '100%',
    marginTop: 8,
    alignItems: 'center',
  },
  idText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#9CA3AF',
  },
  nameText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 2,
  },
});
