import { useState } from 'react';
import './App.css'
import GameInstance from './components/GameInstance'
import { usePokemonNameQuery } from './graphql/generated'

export default function App() {
  const [, setState] = useState<boolean>(false);
  const { loading, error, data } = usePokemonNameQuery({ variables: { language_id: 9 } })
  if (loading) return <div>Loading...</div>
  if (!data || error) return <div>Error occurred. Try reloading.</div>

  const randomPokemon = data.pokemon_v2_pokemonspecies[Math.floor(Math.random() * data.pokemon_v2_pokemonspecies.length)];
  return <>
    <button onClick={() => setState(state => !state)}>New Game</button>
    <GameInstance pokemon={randomPokemon} />
  </>
}