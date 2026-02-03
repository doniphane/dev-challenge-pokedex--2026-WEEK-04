

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

type Props = {
  pokemon: PokemonDetails
  onReset: () => void
}

export default function PokemonCard({ pokemon, onReset }: Props) {
  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      normal: 'badge-neutral',
      fire: 'badge-error',
      water: 'badge-info',
      electric: 'badge-warning',
      grass: 'badge-success',
      ice: 'badge-info',
      fighting: 'badge-error',
      poison: 'badge-secondary',
      ground: 'badge-warning',
      flying: 'badge-info',
      psychic: 'badge-secondary',
      bug: 'badge-success',
      rock: 'badge-warning',
      ghost: 'badge-secondary',
      dragon: 'badge-error',
      dark: 'badge-neutral',
      steel: 'badge-info',
      fairy: 'badge-secondary'
    }
    return colors[type] || 'badge-neutral'
  }

  const getStatColor = (value: number) => {
    if (value >= 120) return 'progress-error'
    if (value >= 80) return 'progress-warning'
    if (value >= 50) return 'progress-info'
    return 'progress-success'
  }

  return (
    <div className="card lg:card-side bg-base-100 shadow-2xl mx-auto max-w-5xl mt-8">
      <figure className="p-8 bg-gradient-to-br from-primary/5 to-secondary/5">
        {pokemon.image ? (
          <img 
            src={pokemon.image} 
            alt={pokemon.name} 
            className="w-64 h-64 object-contain drop-shadow-xl" 
          />
        ) : (
          <div className="w-64 h-64 flex items-center justify-center bg-base-200 rounded-lg">
            <div className="text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-base-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-base-300 mt-2">Aucune image</p>
            </div>
          </div>
        )}
      </figure>
      
      <div className="card-body">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="card-title text-3xl capitalize">
              {pokemon.name}
            </h2>
            <div className="badge badge-outline badge-lg mt-2">
              #{String(pokemon.id).padStart(3, '0')}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 my-4">
          <div className="stat">
            <div className="stat-figure text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div className="stat-title">Taille</div>
            <div className="stat-value text-lg">{pokemon.height / 10} m</div>
          </div>
          
          <div className="stat">
            <div className="stat-figure text-secondary">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
              </svg>
            </div>
            <div className="stat-title">Poids</div>
            <div className="stat-value text-lg">{pokemon.weight / 10} kg</div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
              <span className="badge badge-primary">Types</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {pokemon.types.map((type) => (
                <span 
                  key={type} 
                  className={`badge ${getTypeColor(type)} badge-lg capitalize`}
                >
                  {type}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
              <span className="badge badge-secondary">Abilités</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {pokemon.abilities.map((ability) => (
                <span 
                  key={ability} 
                  className="badge badge-outline badge-lg capitalize"
                >
                  {ability.replace('-', ' ')}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <span className="badge badge-accent">Stats</span>
            </h3>
            <div className="space-y-3">
              {pokemon.stats.map((stat) => (
                <div key={stat.name} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium capitalize">
                      {stat.name.replace('-', ' ')}
                    </span>
                    <span className="text-sm font-bold">{stat.value}</span>
                  </div>
                  <progress 
                    className={`progress ${getStatColor(stat.value)} w-full`} 
                    value={stat.value} 
                    max="255"
                  ></progress>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card-actions justify-end mt-6">
          <button 
            className="btn btn-primary btn-lg"
            onClick={onReset}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Rechercher un autre
          </button>
        </div>
      </div>
    </div>
  )
}
