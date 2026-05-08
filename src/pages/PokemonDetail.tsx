import { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchPokemon, fetchEvolutionChain, fetchMoveDetail, fetchPokemonSpecies, type PokemonStats, type EvolutionChain, type MoveDetail, type PokemonSpecies } from '../services/pokeApi';
import { ArrowLeft, Ruler, Weight, Zap, Shield, Heart, Swords, ShieldAlert, Sparkles, Volume2, Globe, TrendingUp } from 'lucide-react';
import './PokemonDetail.css';

export default function PokemonDetail() {
  const { name } = useParams<{ name: string }>();
  const [pokemon, setPokemon] = useState<PokemonStats | null>(null);
  const [species, setSpecies] = useState<PokemonSpecies | null>(null);
  const [evolutionChain, setEvolutionChain] = useState<EvolutionChain[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVersion, setSelectedVersion] = useState<string>('');

  useEffect(() => {
    if (!name) return;
    setLoading(true);
    async function loadData() {
      if (!name) return;
      try {
        const p = await fetchPokemon(name);
        setPokemon(p);
        
        if (p.species?.url) {
          const s = await fetchPokemonSpecies(p.species.url);
          setSpecies(s);
          
          // Set initial version
          const engEntries = s.flavor_text_entries.filter(e => e.language.name === 'en');
          if (engEntries.length > 0) {
            setSelectedVersion(engEntries[0].version.name);
          }

          const evolutions = await fetchEvolutionChain(p.species.url);
          setEvolutionChain(evolutions);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [name]);

  const playCry = () => {
    if (pokemon?.cries?.latest) {
      new Audio(pokemon.cries.latest).play();
    }
  };

  const currentFlavorText = useMemo(() => {
    if (!species) return '';
    const entry = species.flavor_text_entries.find(
      e => e.language.name === 'en' && e.version.name === selectedVersion
    );
    return entry ? entry.flavor_text.replace(/\f/g, ' ') : '';
  }, [species, selectedVersion]);

  const versions = useMemo(() => {
    if (!species) return [];
    return Array.from(new Set(
      species.flavor_text_entries
        .filter(e => e.language.name === 'en')
        .map(e => e.version.name)
    ));
  }, [species]);

  if (loading) return <div className="loading">Catching Pokemon data...</div>;
  if (!pokemon) return <div className="error">Pokemon not found</div>;

  return (
    <div className="pokemon-detail">
      <div className="detail-nav">
        <Link to="/" className="back-button">
          <ArrowLeft size={20} />
          Back to Pokedex
        </Link>
        <button onClick={playCry} className="cry-button" title="Play Cry">
          <Volume2 size={24} />
          <span>Listen to Cry</span>
        </button>
      </div>

      <div className="hero-section">
        <div className={`hero-card type-${pokemon.types[0].type.name}`}>
          <div className="hero-header">
            <h1>{pokemon.name}</h1>
            <span className="pokedex-number">#{String(pokemon.id).padStart(3, '0')}</span>
          </div>
          <div className="type-badges">
            {pokemon.types.map(t => (
              <span key={t.type.name} className={`type-badge-pill`}>
                {t.type.name}
              </span>
            ))}
          </div>
          <img src={pokemon.image} alt={pokemon.name} className="hero-image" />
        </div>

        <div className="species-info-container">
          {species && (
            <div className="pokedex-entry-box">
              <div className="entry-header">
                <h2>Pokedex Entry</h2>
                <select 
                  value={selectedVersion} 
                  onChange={(e) => setSelectedVersion(e.target.value)}
                  className="version-select"
                >
                  {versions.map(v => (
                    <option key={v} value={v}>{v.replace(/-/g, ' ')}</option>
                  ))}
                </select>
              </div>
              <p className="flavor-text">"{currentFlavorText}"</p>
              
              <div className="species-traits">
                <div className="trait">
                  <Globe size={18} />
                  <span>Habitat: <strong>{species.habitat?.name || 'Unknown'}</strong></span>
                </div>
                <div className="trait">
                  <TrendingUp size={18} />
                  <span>Growth: <strong>{species.growth_rate.name.replace(/-/g, ' ')}</strong></span>
                </div>
              </div>
            </div>
          )}

          <div className="info-cards-row">
            <div className="info-card">
              <div className="info-icon"><Ruler /></div>
              <div className="info-value">{(pokemon.height / 10).toFixed(1)}m</div>
              <div className="info-label">Height</div>
            </div>
            <div className="info-card">
              <div className="info-icon"><Weight /></div>
              <div className="info-value">{(pokemon.weight / 10).toFixed(1)}kg</div>
              <div className="info-label">Weight</div>
            </div>
          </div>
          
          <div className="abilities-card">
            <div className="info-icon"><Zap /></div>
            <div className="info-label">Abilities</div>
            <div className="ability-pills">
              {pokemon.abilities.map(a => (
                <span key={a.ability.name} className="ability-pill">
                  {a.ability.name.replace(/-/g, ' ')}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="detail-grid">
        <section className="stats-section">
          <h2>Base Stats</h2>
          <div className="stats-container">
            {pokemon.stats.map(s => (
              <StatRow key={s.stat.name} name={s.stat.name} value={s.base_stat} />
            ))}
          </div>
        </section>

        <section className="moves-section">
          <h2>Moves <span className="sub-title">(Hover for details)</span></h2>
          <div className="moves-grid">
            {pokemon.moves.slice(0, 24).map(m => (
              <MoveBadge key={m.move.name} name={m.move.name} url={m.move.url} />
            ))}
          </div>
        </section>
      </div>

      {evolutionChain && (
        <section className="evolution-section">
          <h2>Evolution Chain</h2>
          <div className="evolution-display">
            {renderEvolutionChain(evolutionChain[0])}
          </div>
        </section>
      )}
    </div>
  );
}

function StatRow({ name, value }: { name: string, value: number }) {
  const icons: Record<string, any> = {
    'hp': <Heart size={16} />,
    'attack': <Swords size={16} />,
    'defense': <Shield size={16} />,
    'special-attack': <Sparkles size={16} />,
    'special-defense': <ShieldAlert size={16} />,
    'speed': <Zap size={16} />,
  };

  const colors: Record<string, string> = {
    'hp': '#ff5350',
    'attack': '#f08030',
    'defense': '#f8d030',
    'special-attack': '#6890f0',
    'special-defense': '#78c850',
    'speed': '#f85888',
  };

  return (
    <div className="stat-row">
      <div className="stat-info">
        <span className="stat-icon" style={{ color: colors[name] || '#666' }}>{icons[name] || <Zap size={16}/>}</span>
        <span className="stat-name">{name.replace('special-', 'Sp. ')}</span>
      </div>
      <div className="stat-bar-container">
        <div className="stat-bar-bg">
          <div 
            className="stat-bar-fill" 
            style={{ 
              width: `${(value / 255) * 100}%`,
              backgroundColor: colors[name] || '#666'
            }}
          ></div>
        </div>
        <span className="stat-value">{value}</span>
      </div>
    </div>
  );
}

function MoveBadge({ name, url }: { name: string, url: string }) {
  const [move, setMove] = useState<MoveDetail | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    if (showTooltip && !move) {
      fetchMoveDetail(url).then(setMove);
    }
  }, [showTooltip, move, url]);

  return (
    <div 
      className="move-badge-container"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <span className="move-badge">{name.replace('-', ' ')}</span>
      {showTooltip && (
        <div className="move-tooltip">
          {move ? (
            <>
              <div className="tooltip-header">
                <span className="tooltip-name">{move.name.replace('-', ' ')}</span>
                <span className={`type-badge type-${move.type.name}`}>{move.type.name}</span>
              </div>
              <div className="tooltip-stats">
                {move.power && <span>Pwr: {move.power}</span>}
                {move.accuracy && <span>Acc: {move.accuracy}%</span>}
                <span>PP: {move.pp}</span>
              </div>
              <p className="tooltip-desc">
                {move.flavor_text_entries.find(e => e.language.name === 'en')?.flavor_text || "No details."}
              </p>
            </>
          ) : (
            <div className="tooltip-loading">Loading...</div>
          )}
        </div>
      )}
    </div>
  );
}

function renderEvolutionChain(chain: EvolutionChain): React.ReactNode {
  return (
    <div className="evolution-node">
      <Link to={`/pokemon/${chain.species_name}`} className="evo-item">
        <div className="evo-image-wrapper">
          <img src={chain.image} alt={chain.species_name} />
        </div>
        <span className="evo-name">{chain.species_name}</span>
        {chain.trigger && (
          <div className="evo-trigger">
            {chain.trigger.replace('-', ' ')} {chain.min_level ? `(Lv. ${chain.min_level})` : ''}
            {chain.item ? ` via ${chain.item.replace('-', ' ')}` : ''}
          </div>
        )}
      </Link>
      {chain.evolves_to.length > 0 && (
        <div className="evolution-children">
          {chain.evolves_to.map(child => (
            <div key={child.species_name} className="evo-branch">
              <div className="evo-arrow">→</div>
              {renderEvolutionChain(child)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
