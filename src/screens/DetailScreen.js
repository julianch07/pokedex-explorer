import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { getPokemonDetail } from '../services/pokemonService';
import TypeBadge from '../components/TypeBadge';
import StatBar from '../components/StatBar';

/**
 * Concept: detail view with the 4 UI states (loading, error, success).
 * "No results" does not apply here: the id always comes from a card.
 */
export default function DetailScreen({ pokemonId, onBack }) {
  const [pokemon, setPokemon] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  /**
   * Concept: useEffect dependency array.
   * [pokemonId] -> the request only runs again if the selected Pokémon changes.
   */
  useEffect(() => {
    fetchDetail();
  }, [pokemonId]);

  const fetchDetail = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const data = await getPokemonDetail(pokemonId);
      setPokemon(data);
    } catch (error) {
      setErrorMessage('No pudimos cargar la ficha del Pokémon. Revisa tu conexión a internet.');
    } finally {
      setIsLoading(false);
    }
  };

  // State: loading
  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#DC2626" />
        <Text style={styles.loadingText}>Cargando ficha del Pokémon...</Text>
      </View>
    );
  }

  // State: error (message + "Reintentar")
  if (errorMessage || !pokemon) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorTitle}>¡Ups! Algo salió mal</Text>
        <Text style={styles.errorText}>{errorMessage}</Text>
        <TouchableOpacity style={styles.primaryButton} onPress={fetchDetail}>
          <Text style={styles.primaryButtonText}>Reintentar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryButton} onPress={onBack}>
          <Text style={styles.secondaryButtonText}>Volver a la lista</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Concept: number with leading zeros -> #025
  const formattedId = `#${String(pokemon.id).padStart(3, '0')}`;
  const capitalizedName = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);

  // State: success
  return (
    <ScrollView style={styles.wrapper} contentContainerStyle={styles.scrollContent}>
      <View style={styles.imageCard}>
        {/* Concept: remote Image needs explicit width and height */}
        <Image
          source={{ uri: pokemon.imageUrl }}
          style={styles.largeImage}
          resizeMode="contain"
        />
      </View>

      <View style={styles.titleSection}>
        <Text style={styles.pokemonName}>{capitalizedName}</Text>
        <Text style={styles.pokemonNumber}>{formattedId}</Text>
      </View>

      <View style={styles.typesRow}>
        {pokemon.types.map((typeName) => (
          <TypeBadge key={typeName} typeName={typeName} />
        ))}
      </View>

      <View style={styles.physicalRow}>
        <View style={styles.physicalItem}>
          <Text style={styles.physicalLabel}>ALTURA</Text>
          <Text style={styles.physicalValue}>{pokemon.height} m</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.physicalItem}>
          <Text style={styles.physicalLabel}>PESO</Text>
          <Text style={styles.physicalValue}>{pokemon.weight} kg</Text>
        </View>
      </View>

      <View style={styles.statsCard}>
        <Text style={styles.statsTitle}>Estadísticas base</Text>
        {pokemon.stats.map((stat) => (
          <StatBar key={stat.name} statName={stat.name} baseStat={stat.value} />
        ))}
      </View>

      <TouchableOpacity style={styles.primaryButton} onPress={onBack}>
        <Text style={styles.primaryButtonText}>Volver a la lista</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  imageCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  largeImage: {
    width: 220,
    height: 220,
  },
  titleSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  pokemonName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
  },
  pokemonNumber: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#9CA3AF',
  },
  typesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  physicalRow: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  physicalItem: {
    flex: 1,
    alignItems: 'center',
  },
  divider: {
    width: 1,
    backgroundColor: '#E5E7EB',
  },
  physicalLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
    marginBottom: 4,
  },
  physicalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  statsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 20,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 14,
  },
  primaryButton: {
    backgroundColor: '#DC2626',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    marginTop: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  secondaryButtonText: {
    color: '#DC2626',
    fontSize: 15,
    fontWeight: '600',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#F9FAFB',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#4B5563',
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 6,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 18,
    textAlign: 'center',
  },
});
