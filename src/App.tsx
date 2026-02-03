import React, { useEffect, useState } from 'react'
import './App.css'
import PokemonCard from './components/PokemonCard'

type PokemonDetails = {
  id: number
  name: string
  height: number
  weight: number
  types: string[]
  abilities: string[]
  stats: { name: string; value: number }[]
  image: string | null
}

function App() {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [allNames, setAllNames] = useState<string[]>([])
  const [pokemon, setPokemon] = useState<PokemonDetails | null>(null)

  useEffect(() => {
    // Récupère la liste globale des noms (une seule fois)
    let mounted = true
    fetch('https://pokeapi.co/api/v2/pokemon?limit=2000')
      .then((r) => r.json())
      .then((data) => {
        if (!mounted) return
        const names = (data.results || []).map((r: any) => r.name)
        setAllNames(names)
        setSuggestions(pickRandom(names, 8))
      })
      .catch(() => {
        /* ignore */
      })
    return () => {
      mounted = false
    }
  }, [])

  function pickRandom(list: string[], n: number) {
    const out: string[] = []
    const seen = new Set<number>()
    const max = Math.min(n, list.length)
    while (out.length < max) {
      const i = Math.floor(Math.random() * list.length)
      if (!seen.has(i)) {
        seen.add(i)
        out.push(list[i])
      }
    }
    return out
  }

  async function fetchPokemonByName(q: string) {
    const name = q.trim().toLowerCase()
    if (!name) return
    setLoading(true)
    setError(null)
    setPokemon(null)
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(name)}`)
      if (!res.ok) throw new Error('Pokémon introuvable')
      const data = await res.json()
      const image = data.sprites?.other?.['official-artwork']?.front_default
        ?? data.sprites?.front_default
        ?? null
      const details: PokemonDetails = {
        id: data.id,
        name: data.name,
        height: data.height,
        weight: data.weight,
        types: (data.types || []).map((t: any) => t.type.name),
        abilities: (data.abilities || []).map((a: any) => a.ability.name),
        stats: (data.stats || []).map((s: any) => ({ name: s.stat.name, value: s.base_stat })),
        image,
      }
      setPokemon(details)
    } catch (err: any) {
      setError(err?.message ?? 'Erreur lors de la récupération')
    } finally {
      setLoading(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') fetchPokemonByName(query)
  }

  return (
    <div className="min-h-screen bg-base-200">
      <div className="navbar bg-base-100 shadow-lg">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
              </svg>
            </div>
          </div>
          <a className="btn btn-ghost text-xl">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent font-bold">
              Pokédex
            </span>
          </a>
        </div>
        
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            <li><a href="#" className="font-medium">Accueil</a></li>
            <li><a href="#" className="font-medium">À propos</a></li>
          </ul>
        </div>
        
        <div className="navbar-end">
          <label className="swap swap-rotate">
            <input 
              type="checkbox" 
              className="theme-controller" 
              value="dark"
              onChange={(e) => {
                document.documentElement.setAttribute('data-theme', e.target.checked ? 'dark' : 'light')
              }}
            />
            <svg className="swap-off h-8 w-8 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z"/>
            </svg>
            <svg className="swap-on h-8 w-8 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z"/>
            </svg>
          </label>
        </div>
      </div>

      <div className="hero min-h-80 bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Explorez l'Univers Pokémon
              </span>
            </h1>
            <p className="py-6 text-base-content/70">
              Découvrez tous les Pokémon avec notre recherche interactive et avancée
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="card w-full max-w-2xl mx-auto bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="form-control">
              <label className="label">
                <span className="label-text text-lg font-semibold">Rechercher un Pokémon</span>
                <span className="label-text-alt">Par nom ou ID</span>
              </label>
              <div className="input-group">
                <input
                  type="text"
                  placeholder="ex: pikachu, 25, charizard..."
                  className="input input-bordered input-lg flex-1"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <button 
                  className="btn btn-lg btn-primary" 
                  onClick={() => fetchPokemonByName(query)} 
                  disabled={loading || !query.trim()}
                >
                  {loading ? (
                    <span className="loading loading-spinner loading-md"></span>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="divider">Suggestions rapides</div>
            
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-base-content/70">
                💡 Cliquez sur un Pokémon pour le découvrir
              </span>
              <button 
                className="btn btn-ghost btn-sm btn-circle" 
                onClick={() => setSuggestions(pickRandom(allNames, 8))}
                title="Nouvelles suggestions"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  className="badge badge-outline badge-lg hover:badge-primary transition-all cursor-pointer normal-case"
                  onClick={() => fetchPokemonByName(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {error && (
          <div className="alert alert-error shadow-lg max-w-2xl mx-auto mt-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {pokemon && (
          <PokemonCard pokemon={pokemon} onReset={() => { setPokemon(null); setQuery('') }} />
        )}
      </div>

      <footer className="footer footer-center p-10 bg-base-200 text-base-content">
        <div>
          <p className="font-bold">
            Pokédex App 
            <br/>
            Construit avec React, TypeScript et DaisyUI
          </p> 
          <p>Copyright © 2024 - Tous droits réservés</p>
        </div> 
      </footer>
    </div>
  )
}

export default App
