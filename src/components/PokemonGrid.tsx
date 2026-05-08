import { useEffect, useState, useMemo } from "react";
import { fetchPokemonList, fetchTypes } from "../services/pokeApi";
import type { PokemonListEntry } from "../services/pokeApi";
import PokemonCard from "./PokemonCard";
import { Search, Filter, SlidersHorizontal, ChevronDown } from "lucide-react";
import "./PokemonGrid.css";

const PAGE_SIZE = 20;

export default function PokemonGrid() {
  const [pokemon, setPokemon] = useState<PokemonListEntry[]>([]);
  const [types, setTypes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [sortOrder, setSortOrder] = useState("id-asc");

  useEffect(() => {
    async function init() {
      try {
        const [pokemonRes, typeData] = await Promise.all([
          fetchPokemonList(0, PAGE_SIZE),
          fetchTypes()
        ]);
        setPokemon(pokemonRes.results);
        setTotalCount(pokemonRes.count);
        setTypes(typeData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  const loadMore = async () => {
    if (loadingMore) return;
    setLoadingMore(true);
    try {
      const nextOffset = pokemon.length;
      const res = await fetchPokemonList(nextOffset, PAGE_SIZE);
      setPokemon(prev => [...prev, ...res.results]);
    } catch (error) {
      console.error("Error loading more:", error);
    } finally {
      setLoadingMore(false);
    }
  };

  const filteredPokemon = useMemo(() => {
    let result = [...pokemon];

    if (searchQuery) {
      result = result.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.url.split('/').filter(Boolean).pop() === searchQuery
      );
    }

    result.sort((a, b) => {
      const idA = parseInt(a.url.split('/').filter(Boolean).pop()!);
      const idB = parseInt(b.url.split('/').filter(Boolean).pop()!);
      
      if (sortOrder === "id-asc") return idA - idB;
      if (sortOrder === "id-desc") return idB - idA;
      if (sortOrder === "name-asc") return a.name.localeCompare(b.name);
      if (sortOrder === "name-desc") return b.name.localeCompare(a.name);
      return 0;
    });

    return result;
  }, [pokemon, searchQuery, sortOrder]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="pokeball-loader"></div>
        <p>Catching them all...</p>
      </div>
    );
  }

  return (
    <div className="pokedex-container">
      <div className="controls-section">
        <div className="search-wrapper">
          <Search className="search-icon" size={20} />
          <input 
            type="text" 
            placeholder="Search loaded Pokemon..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filters-group">
          <div className="select-wrapper">
            <Filter className="select-icon" size={18} />
            <select 
              value={selectedType} 
              onChange={(e) => setSelectedType(e.target.value)}
              className="filter-select"
            >
              <option value="">All Types</option>
              {types.map(t => (
                <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
              ))}
            </select>
          </div>

          <div className="select-wrapper">
            <SlidersHorizontal className="select-icon" size={18} />
            <select 
              value={sortOrder} 
              onChange={(e) => setSortOrder(e.target.value)}
              className="filter-select"
            >
              <option value="id-asc">Lowest ID</option>
              <option value="id-desc">Highest ID</option>
              <option value="name-asc">A-Z</option>
              <option value="name-desc">Z-A</option>
            </select>
          </div>
        </div>
      </div>

      <div className="results-info">
        Showing {pokemon.length} of {totalCount} Pokemon
      </div>

      <div className="pokemon-grid">
        {filteredPokemon.map((p) => (
          <PokemonCard key={p.name} pokemon={p} />
        ))}
      </div>
      
      {pokemon.length < totalCount && (
        <button 
          className="load-more-button" 
          onClick={loadMore} 
          disabled={loadingMore}
        >
          {loadingMore ? (
            "Loading..."
          ) : (
            <>
              <ChevronDown size={20} />
              Load More Pokemon
            </>
          )}
        </button>
      )}
    </div>
  );
}
