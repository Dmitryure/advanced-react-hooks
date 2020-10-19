// useContext: Caching response data in context
// 💯 caching in a context provider (exercise)
// http://localhost:3000/isolated/exercise/03.extra-2.js

// you can edit this here and look at the isolated page or you can copy/paste
// this in the regular exercise file.

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import {
  fetchPokemon,
  PokemonForm,
  PokemonDataView,
  PokemonInfoFallback,
  PokemonErrorBoundary,
} from '../pokemon'
import {useAsync} from '../utils'

// 🐨 Create a PokemonCacheContext
const PokemonCacheContext = createContext(null)

// 🐨 create a PokemonCacheProvider function
const PokemonCacheProvider = props => {
  const [cachedPokemons, setCachedPokemons] = useState({})

  const cachePokemon = ({pokemonName, pokemonData}) => {
    if (cachedPokemons[pokemonName]) {
      return
    }
    setCachedPokemons(state => ({...state, [pokemonName]: pokemonData}))
  }

  return (
    <PokemonCacheContext.Provider value={{cachedPokemons, cachePokemon}}>
      {props.children}
    </PokemonCacheContext.Provider>
  )
}
// 🐨 useReducer with pokemonCacheReducer in your PokemonCacheProvider
// 💰 you can grab the one that's in PokemonInfo
// 🐨 return your context provider with the value assigned to what you get back from useReducer
// 💰 value={[cache, dispatch]}
// 💰 make sure you forward the props.children!

function PokemonInfo({pokemonName}) {
  const context = useContext(PokemonCacheContext)

  const {cachedPokemons, cachePokemon} = context

  const {data: pokemon, status, error, run, setData} = useAsync()

  React.useEffect(() => {
    if (!pokemonName) {
      return
    } else if (cachedPokemons[pokemonName]) {
      setData(cachedPokemons[pokemonName])
    } else {
      run(
        fetchPokemon(pokemonName).then(pokemonData => {
          cachePokemon({type: 'ADD_POKEMON', pokemonName, pokemonData})
          return pokemonData
        }),
      )
    }
  }, [cachePokemon, cachedPokemons, pokemonName, run, setData])

  if (status === 'idle') {
    return 'Submit a pokemon'
  } else if (status === 'pending') {
    return <PokemonInfoFallback name={pokemonName} />
  } else if (status === 'rejected') {
    throw error
  } else if (status === 'resolved') {
    return <PokemonDataView pokemon={pokemon} />
  }
}

function PreviousPokemon({onSelect}) {
  // 🐨 get the cache from useContext with PokemonCacheContext
  const context = useContext(PokemonCacheContext)
  const cache = context.cachedPokemons
  return (
    <div>
      Previous Pokemon
      <ul style={{listStyle: 'none', paddingLeft: 0}}>
        {Object.keys(cache).map(pokemonName => (
          <li key={pokemonName} style={{margin: '4px auto'}}>
            <button
              style={{width: '100%'}}
              onClick={() => onSelect(pokemonName)}
            >
              {pokemonName}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

function PokemonSection({onSelect, pokemonName}) {
  // 🐨 wrap this in the PokemonCacheProvider so the PreviousPokemon
  // and PokemonInfo components have access to that context.
  return (
    <PokemonCacheProvider>
      <div style={{display: 'flex'}}>
        <PreviousPokemon onSelect={onSelect} />
        <div className="pokemon-info" style={{marginLeft: 10}}>
          <PokemonErrorBoundary
            onReset={() => onSelect('')}
            resetKeys={[pokemonName]}
          >
            <PokemonInfo pokemonName={pokemonName} />
          </PokemonErrorBoundary>
        </div>
      </div>
    </PokemonCacheProvider>
  )
}

function App() {
  const [pokemonName, setPokemonName] = React.useState(null)

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  function handleSelect(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <PokemonSection onSelect={handleSelect} pokemonName={pokemonName} />
    </div>
  )
}

export default App
