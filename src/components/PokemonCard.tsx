import { Link } from 'react-router-dom';
import type { PokemonListEntry } from '../services/pokeApi';
import './PokemonCard.css';

interface PokemonCardProps {
  pokemon: PokemonListEntry;
}

export default function PokemonCard({ pokemon }: PokemonCardProps) {
  const id = pokemon.url.split('/').filter(Boolean).pop()!;
  const image = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
  const formattedName = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);

  return (
    <Link to={`/pokemon/${pokemon.name}`} className="pokemon-card">
      <span className="pokemon-id-badge">#{String(id).padStart(3, '0')}</span>
      <img src={image} alt={formattedName} loading="lazy" />
      <span className="pokemon-name">{formattedName}</span>
    </Link>
  );
}
