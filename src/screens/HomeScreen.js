import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { getPokemonList, getPokemonDetail } from '../services/pokemonService';
import PokemonCard from '../components/PokemonCard';
import SearchBar from '../components/SearchBar';

const PAGE_SIZE = 20;

/**
 * Concept: list view with the 4 UI states
 * (loading, error, no results and success).
 */
export default function HomeScreen({ onSelectPokemon }) {
  const [pokemonList, setPokemonList] = useState([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [loadMoreFailed, setLoadMoreFailed] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isNotFound, setIsNotFound] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Guard against onEndReached firing twice before the state updates
  const isFetchingMore = useRef(false);

  /**
   * Concept: useEffect dependency array.
   * Empty array [] -> the first page is requested only once, on mount.
   */
  useEffect(() => {
    loadFirstPage();
  }, []);

  // Loads the first 20 Pokémon (also used to leave the search mode)
  const loadFirstPage = async () => {
    setIsSearching(false);
    setIsLoading(true);
    setErrorMessage(null);
    setIsNotFound(false);
    setLoadMoreFailed(false);

    try {
      const data = await getPokemonList(0, PAGE_SIZE);
      setPokemonList(data.results);
      setOffset(PAGE_SIZE);
      setHasMore(data.hasMore);
    } catch (error) {
      setErrorMessage('No pudimos cargar los Pokémon. Revisa tu conexión a internet.');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Concept: infinite scroll with onEndReached.
   * Loads 20 more Pokémon when the user reaches the end of the list.
   */
  const fetchNextPage = async () => {
    if (isFetchingMore.current || isLoading || isSearching || !hasMore) {
      return;
    }

    isFetchingMore.current = true;
    setIsLoadingMore(true);
    setLoadMoreFailed(false);

    try {
      const data = await getPokemonList(offset, PAGE_SIZE);
      setPokemonList((prev) => [...prev, ...data.results]);
      setOffset((prev) => prev + PAGE_SIZE);
      setHasMore(data.hasMore);
    } catch (error) {
      setLoadMoreFailed(true);
    } finally {
      isFetchingMore.current = false;
      setIsLoadingMore(false);
    }
  };

  // After a failure, onEndReached stays quiet: only the footer "Reintentar" asks again
  const handleEndReached = () => {
    if (!loadMoreFailed) {
      fetchNextPage();
    }
  };

  /**
   * Concept: search by name or number using /pokemon/{name or id}.
   */
  const handleSearch = async (term) => {
    const query = term.trim().toLowerCase();

    // Empty search: go back to the paginated list
    if (!query) {
      loadFirstPage();
      return;
    }

    setSearchQuery(query);
    setIsSearching(true);
    setIsLoading(true);
    setErrorMessage(null);
    setIsNotFound(false);
    setLoadMoreFailed(false);

    try {
      const pokemon = await getPokemonDetail(query);
      setPokemonList([{ id: pokemon.id, name: pokemon.name, imageUrl: pokemon.imageUrl }]);
    } catch (error) {
      setPokemonList([]);
      if (error.message === 'NOT_FOUND') {
        // State: no results
        setIsNotFound(true);
      } else {
        // State: error
        setErrorMessage('Ocurrió un error al buscar el Pokémon. Revisa tu conexión e inténtalo de nuevo.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // "Reintentar" repeats whatever request failed: the search or the first page
  const handleRetry = () => {
    if (isSearching) {
      handleSearch(searchQuery);
    } else {
      loadFirstPage();
    }
  };

  /**
   * Concept: list footer. Spinner while loading more, or error + retry.
   */
  const renderFooter = () => {
    if (isLoadingMore) {
      return (
        <View style={styles.footer}>
          <ActivityIndicator size="small" color="#DC2626" />
          <Text style={styles.footerText}>Cargando más Pokémon...</Text>
        </View>
      );
    }
    if (loadMoreFailed) {
      return (
        <View style={styles.footer}>
          <Text style={styles.footerText}>No se pudieron cargar más Pokémon.</Text>
          <TouchableOpacity style={styles.smallRetryButton} onPress={fetchNextPage}>
            <Text style={styles.retryButtonText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return null;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>PokéDex Explorer</Text>
      </View>

      <SearchBar onSearch={handleSearch} onClear={loadFirstPage} />

      {/* State: loading */}
      {isLoading && (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#DC2626" />
          <Text style={styles.stateText}>Cargando Pokémon...</Text>
        </View>
      )}

      {/* State: error */}
      {!isLoading && errorMessage && (
        <View style={styles.centerContainer}>
          <Text style={styles.stateTitle}>¡Ups! Algo salió mal</Text>
          <Text style={styles.stateDescription}>{errorMessage}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
            <Text style={styles.retryButtonText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* State: no results */}
      {!isLoading && !errorMessage && isNotFound && (
        <View style={styles.centerContainer}>
          <Text style={styles.stateTitle}>No encontramos a "{searchQuery}"</Text>
          <Text style={styles.stateDescription}>
            Verifica el nombre o el número e inténtalo de nuevo.
          </Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadFirstPage}>
            <Text style={styles.retryButtonText}>Ver todos los Pokémon</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* State: success */}
      {!isLoading && !errorMessage && !isNotFound && (
        <FlatList
          data={pokemonList}
          keyExtractor={(item) => String(item.id)}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <PokemonCard item={item} onPress={() => onSelectPokemon(item.id)} />
          )}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#DC2626',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  listContent: {
    padding: 12,
    paddingBottom: 24,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  stateText: {
    marginTop: 12,
    fontSize: 16,
    color: '#4B5563',
    fontWeight: '500',
  },
  stateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 6,
    textAlign: 'center',
  },
  stateDescription: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 18,
  },
  retryButton: {
    backgroundColor: '#DC2626',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  smallRetryButton: {
    backgroundColor: '#DC2626',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 15,
  },
  footer: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerText: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 6,
  },
});
