import './App.css'
import GameInstance from './components/GameInstance'
import { usePokemonNameQuery } from './graphql/generated'

export default function App() {
  const { loading, error, data } = usePokemonNameQuery({ variables: { language_id: 9 } })
  if (loading) return <div>Loading...</div>
  if (!data || error) return <div>Error occurred. Try reloading.</div>

  const randomPokemon = data.pokemon_v2_pokemonspecies[Math.floor(Math.random() * data.pokemon_v2_pokemonspecies.length)];
  return <GameInstance pokemon={randomPokemon}/>
}