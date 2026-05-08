const BASE_URL = 'https://pokeapi.co/api/v2';

export interface PokemonListEntry {
    name: string;
    url: string;
}

export interface PokemonListResponse {
    results: PokemonListEntry[];
    count: number;
}

export interface PokemonStats {
    name: string;
    id: number;
    image: string;
    types: { type: { name: string } }[];
    stats: { stat: { name: string }; base_stat: number }[];
    height: number;
    weight: number;
    abilities: { ability: { name: string } }[];
    moves: { move: { name: string; url: string } }[];
    sprites: {
        front_default: string;
        back_default: string | null;
        front_shiny: string | null;
        back_shiny: string | null;
        other?: {
            'official-artwork': {
                front_default: string;
            };
        };
    };
    species: { url: string };
    cries: {
        latest: string;
        legacy: string;
    };
}

export interface PokemonSpecies {
    flavor_text_entries: {
        flavor_text: string;
        language: { name: string };
        version: { name: string };
    }[];
    habitat: { name: string } | null;
    growth_rate: { name: string };
    evolution_chain: { url: string };
}

export async function fetchPokemonSpecies(url: string): Promise<PokemonSpecies> {
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch species data');
    return await res.json();
}

export interface ItemListEntry {
    name: string;
    url: string;
}

export interface ItemDetail {
    name: string;
    id: number;
    cost: number;
    sprites: { default: string };
    flavor_text_entries: { flavor_text: string; language: { name: string } }[];
    category: { name: string };
}

export interface MoveDetail {
    name: string;
    type: { name: string };
    power: number | null;
    accuracy: number | null;
    pp: number;
    flavor_text_entries: { flavor_text: string; language: { name: string } }[];
}

export interface EvolutionChain {
    species_name: string;
    image: string;
    min_level: number | null;
    trigger: string | null;
    item: string | null;
    evolves_to: EvolutionChain[];
}

export async function fetchPokemonList(offset = 0, limit = 20): Promise<PokemonListResponse> {
    const res = await fetch(`${BASE_URL}/pokemon?offset=${offset}&limit=${limit}`);
    if (!res.ok) throw new Error('Failed to fetch Pokemon list');
    return await res.json();
}

export async function fetchPokemon(name: string): Promise<PokemonStats> {
    const res = await fetch(`${BASE_URL}/pokemon/${name}`);
    if (!res.ok) throw new Error(`Failed to fetch Pokemon: ${name}`);
    const data = await res.json();
    return {
        ...data,
        image: data.sprites.other?.['official-artwork']?.front_default || data.sprites.front_default,
    };
}

export async function fetchItemList(offset = 0, limit = 20): Promise<{results: ItemListEntry[], count: number}> {
    const res = await fetch(`${BASE_URL}/item?offset=${offset}&limit=${limit}`);
    if (!res.ok) throw new Error('Failed to fetch item list');
    return await res.json();
}

export async function fetchItemDetail(name: string): Promise<ItemDetail> {
    const res = await fetch(`${BASE_URL}/item/${name}`);
    if (!res.ok) throw new Error(`Failed to fetch item: ${name}`);
    return await res.json();
}

export async function fetchMoveDetail(url: string): Promise<MoveDetail> {
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch move detail');
    return await res.json();
}

export async function fetchEvolutionChain(speciesUrl: string): Promise<EvolutionChain[]> {
    const speciesRes = await fetch(speciesUrl);
    const speciesData = await speciesRes.json();
    const chainRes = await fetch(speciesData.evolution_chain.url);
    const chainData = await chainRes.json();

    const processChain = async (chain: any): Promise<EvolutionChain> => {
        const name = chain.species.name;
        const id = chain.species.url.split('/').filter(Boolean).pop();
        const image = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
        
        const evolves_to = await Promise.all(
            chain.evolves_to.map((e: any) => processChain(e))
        );

        const details = chain.evolution_details[0] || {};
        return {
            species_name: name,
            image,
            min_level: details.min_level || null,
            trigger: details.trigger?.name || null,
            item: details.item?.name || null,
            evolves_to,
        };
    };

    return [await processChain(chainData.chain)];
}

export async function fetchTypes(): Promise<string[]> {
    const res = await fetch(`${BASE_URL}/type`);
    const data = await res.json();
    return data.results.map((t: any) => t.name).filter((n: string) => n !== 'unknown' && n !== 'shadow');
}

export async function fetchGenerations(): Promise<{name: string, url: string}[]> {
    const res = await fetch(`${BASE_URL}/generation`);
    const data = await res.json();
    return data.results;
}
