/**
 * PokéAPI service.
 * Workshop rule: network logic is kept apart from the UI (JSX and styles).
 * Screens only receive plain, ready-to-render objects from this file.
 */

const BASE_URL = 'https://pokeapi.co/api/v2';

/**
 * Concept: remote image without requesting the full Pokémon record.
 */
export const getOfficialArtworkUrl = (id) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

/**
 * Concept: the list endpoint only returns name and url, so the id is
 * extracted from the end of the url.
 * Example: "https://pokeapi.co/api/v2/pokemon/25/" -> 25
 */
export const extractIdFromUrl = (url) => {
  const parts = url.split('/').filter(Boolean);
  return Number(parts[parts.length - 1]);
};

/**
 * Concept: input sanitizing. Lowercase, no spaces at the start or end.
 * It also accepts "#025" or "025" (the way the number is shown in the cards).
 */
export const normalizeQuery = (text) => {
  const query = String(text).trim().toLowerCase().replace(/^#/, '');
  return /^\d+$/.test(query) ? String(Number(query)) : query;
};

/**
 * Concept: REST call with fetch + async/await (paginated list).
 * Returns cards-ready data: { results: [{ id, name, imageUrl }], hasMore }.
 */
export const getPokemonList = async (offset = 0, limit = 20) => {
  const response = await fetch(`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`);

  // Concept: check response.ok before calling response.json()
  if (!response.ok) {
    throw new Error(`HTTP_${response.status}`);
  }

  const data = await response.json();

  return {
    results: data.results.map((item) => {
      const id = extractIdFromUrl(item.url);
      return { id, name: item.name, imageUrl: getOfficialArtworkUrl(id) };
    }),
    hasMore: data.next !== null,
  };
};

/**
 * Concept: detail by name or id.
 * Returns { id, name, height (m), weight (kg), types: string[],
 * stats: [{ name, value }], imageUrl }.
 * Throws Error('NOT_FOUND') when the Pokémon does not exist.
 */
export const getPokemonDetail = async (identifier) => {
  const query = normalizeQuery(identifier);

  if (!query) {
    throw new Error('NOT_FOUND');
  }

  const response = await fetch(`${BASE_URL}/pokemon/${query}`);

  // Concept: a missing name answers 404 with plain text, not JSON.
  // response.ok must be checked BEFORE response.json().
  if (!response.ok) {
    throw new Error(response.status === 404 ? 'NOT_FOUND' : `HTTP_${response.status}`);
  }

  const data = await response.json();

  return {
    id: data.id,
    name: data.name,
    // Concept: height comes in decimeters and weight in hectograms -> divide by 10
    height: data.height / 10,
    weight: data.weight / 10,
    types: data.types.map((item) => item.type.name),
    stats: data.stats.map((item) => ({ name: item.stat.name, value: item.base_stat })),
    imageUrl:
      data.sprites?.other?.['official-artwork']?.front_default ||
      getOfficialArtworkUrl(data.id),
  };
};
