import { PokemonNameQuery, useDexEntriesQuery } from '../graphql/generated';
import { useState, useMemo, useEffect } from 'react';
import { ArrayType } from '../types';

interface Props {
	pokemon: ArrayType<PokemonNameQuery['pokemon_v2_pokemonspecies']>
}
export default function GameInstance({ pokemon: { name, pokemon_v2_pokemonspeciesnames: [{ name: languageName }] } }: Props) {
	const [revealed, setRevealed] = useState<number>(1);
	const [showAnswer, setShowAnswer] = useState<boolean>(false);
	useEffect(() => {
		setRevealed(1);
		setShowAnswer(false)
	}, [name])

	const { loading, error, data } = useDexEntriesQuery({ variables: { pokemon: name, language_id: 9 } });
	const dexEntries = useMemo(() =>
		data?.pokemon_v2_pokemonspecies[0].pokemon_v2_pokemonspeciesflavortexts
			.map(entry => ({
				text: entry.flavor_text.replace(/\n|\f/g, " ").replace(new RegExp(name, "gi"), "[REDACTED]"),
				game: entry.pokemon_v2_version?.pokemon_v2_versionnames[0].name ?? "Extra"
			}))
			.filter((entry, _, entries) => entries.find(({ text }) => text == entry.text) == entry)
			.sort(() => Math.random()), [data])
	if (loading) return <div>Loading...</div>
	if (!data || !dexEntries || error) return <div>Error occurred. Try reloading.</div>

	return <div>
		<button onClick={() => setRevealed(count => Math.min(count + 1, dexEntries.length))}>Reveal New Entry</button>
		<button onClick={() => setShowAnswer(showAnswer => !showAnswer)}>{showAnswer ? "Hide Answer" : "Show Answer"}</button>
		<h1>{showAnswer && languageName}</h1>
		{dexEntries.map((entry, i) => i + 1 <= revealed &&
			<div key={i}>
				<p className={revealed ? "entry show-box" : "entry"}>{entry.text}</p>
			</div>
		)}
	</div>
}