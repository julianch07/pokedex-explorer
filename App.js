import React, { useState, useEffect } from 'react';
import { StyleSheet, View, BackHandler } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import HomeScreen from './src/screens/HomeScreen';
import DetailScreen from './src/screens/DetailScreen';

/**
 * PokéDex Explorer workshop.
 * Concept: one main screen with two views (list and detail) chosen with
 * state, without Expo Router.
 */
export default function App() {
  // null = list view; a number = detail view of that Pokémon
  const [selectedPokemonId, setSelectedPokemonId] = useState(null);

  /**
   * Concept: useEffect with dependency array.
   * Android back button returns to the list instead of closing the app.
   */
  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      if (selectedPokemonId !== null) {
        setSelectedPokemonId(null);
        return true;
      }
      return false;
    });
    return () => subscription.remove();
  }, [selectedPokemonId]);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        {/* The list stays mounted (only hidden) so scroll, loaded pages and
            the search are kept when coming back from the detail view */}
        <View style={selectedPokemonId === null ? styles.visible : styles.hidden}>
          <HomeScreen onSelectPokemon={setSelectedPokemonId} />
        </View>

        {selectedPokemonId !== null && (
          <DetailScreen
            pokemonId={selectedPokemonId}
            onBack={() => setSelectedPokemonId(null)}
          />
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  visible: {
    flex: 1,
  },
  hidden: {
    display: 'none',
  },
});
