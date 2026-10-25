# PokéDex Explorer — Taller de Consumo de API con React Native y Expo

Aplicación hecha con React Native y Expo que consume la [PokéAPI](https://pokeapi.co/).

**Nombre completo:** Julian Cardona Hernandez

## Árbol de carpetas y responsabilidad de cada archivo

```text
pokedex-explorer/
├── App.js                      # Entrada. Decide qué vista se muestra (lista o detalle) con un estado
│                               #   y maneja el botón atrás de Android
├── app.json                    # Configuración de Expo
├── package.json                # Dependencias
└── src/
    ├── services/
    │   └── pokemonService.js   # ÚNICO lugar con fetch: lista, detalle, response.ok, 404,
    │                           #   conversión de unidades y normalización del texto de búsqueda
    ├── screens/
    │   ├── HomeScreen.js       # Vista de lista: búsqueda, FlatList, scroll infinito y estados
    │   └── DetailScreen.js     # Vista de detalle: ficha completa y sus estados
    ├── components/
    │   ├── SearchBar.js        # TextInput + botón "Buscar"
    │   ├── PokemonCard.js      # Tarjeta de la cuadrícula (imagen, #025, nombre)
    │   ├── TypeBadge.js        # Distintivo de tipo con color propio
    │   └── StatBar.js          # Estadística con barra proporcional (máximo 255)
    └── constants/
        └── theme.js            # Colores por tipo y nombres en español (tipos y estadísticas)
```