// src/App.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; // Membaca file styling hitam-kuning kita

export default function App() {
  // State manajemen data
  const [pokemonList, setPokemonList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State pencarian & filter dropdown
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');

  // State pagination (Fitur tambahan nilai A)
  const [currentPage, setCurrentPage] = useState(1);
  const [pokemonPerPage] = useState(12);

  // Opsi kategori filter
  const pokemonTypes = ['all', 'fire', 'water', 'grass', 'electric', 'bug', 'normal', 'poison', 'flying'];

  // Ambil data API saat pertama kali dimuat
  useEffect(() => {
    const fetchPokemonData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Endpoint 1: Ambil daftar nama dasar
        const resList = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=100');
        
        // Endpoint 2: Ambil detail gambar & statistik secara paralel
        const detailPromises = resList.data.results.map(async (pokemon) => {
          const resDetail = await axios.get(pokemon.url);
          return {
            id: resDetail.data.id,
            name: resDetail.data.name,
            image: resDetail.data.sprites.other['official-artwork'].front_default || resDetail.data.sprites.front_default,
            types: resDetail.data.types.map((t) => t.type.name),
            hp: resDetail.data.stats[0].base_stat,
            attack: resDetail.data.stats[1].base_stat,
          };
        });

        const detailedResults = await Promise.all(detailPromises);
        setPokemonList(detailedResults);
      } catch (err) {
        setError('Gagal memuat data dari PokeAPI. Periksa jaringan internet Anda.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPokemonData();
  }, []);

  // Filter logika gabungan Search dan Dropdown
  const filteredPokemon = pokemonList.filter((pokemon) => {
    const matchesSearch = pokemon.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || pokemon.types.includes(selectedType);
    return matchesSearch && matchesType;
  });

  // Potong array data untuk kebutuhan Pagination halaman
  const indexOfLastPokemon = currentPage * pokemonPerPage;
  const indexOfFirstPokemon = indexOfLastPokemon - pokemonPerPage;
  const currentPokemonChunk = filteredPokemon.slice(indexOfFirstPokemon, indexOfLastPokemon);
  const totalPages = Math.ceil(filteredPokemon.length / pokemonPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{ paddingBottom: '4rem' }}>
      {/* HEADER BANNER */}
      <header className="pokemon-header">
        <h1>Poké<span>Dashboard</span></h1>
        <p>React PjBL Dashboard • Minimalist Next.js Theme Manual Custom</p>
      </header>

      {/* SEARCH & FILTER KONTROL BAR */}
      <section className="control-container">
        <div className="control-bar">
          <input
            type="text"
            placeholder="Cari nama Pokemon favoritmu..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="search-input"
          />

          <div className="filter-group">
            <span className="filter-label">Element:</span>
            <select
              value={selectedType}
              onChange={(e) => { setSelectedType(e.target.value); setCurrentPage(1); }}
              className="filter-select"
            >
              {pokemonTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>
        <p className="info-text">Menampilkan {filteredPokemon.length} Pokemon yang cocok.</p>
      </section>

      {/* DASHBOARD GRID DISPLAY */}
      <main className="dashboard-main">
        
        {/* JIKA SEDANG LOADING (Tampilkan Kerangka Shimmer) */}
        {loading && (
          <div className="pokemon-grid">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="pokemon-card loading-skeleton" style={{ height: '330px' }}></div>
            ))}
          </div>
        )}

        {/* JIKA TERJADI ERROR */}
        {error && (
          <div className="error-card">
            <p style={{ color: '#f87171', marginBottom: '1.5rem' }}>⚠️ {error}</p>
            <button onClick={() => window.location.reload()} className="reload-btn">
              Muat Ulang Halaman
            </button>
          </div>
        )}

        {/* JIKA SELESAI DAN BERHASIL */}
        {!loading && !error && (
          <>
            {currentPokemonChunk.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem', color: '#a3a3a3' }}>
                Pokemon yang kamu cari tidak ditemukan 🔍
              </div>
            ) : (
              <div className="pokemon-grid">
                {currentPokemonChunk.map((pokemon) => (
                  <div key={pokemon.id} className="pokemon-card">
                    
                    <div className="image-container">
                      <span className="pokemon-id">#{String(pokemon.id).padStart(3, '0')}</span>
                      <img src={pokemon.image} alt={pokemon.name} className="pokemon-image" />
                    </div>

                    <div className="card-info">
                      <h3 className="pokemon-name">{pokemon.name}</h3>
                      
                      <div className="badge-container">
                        {pokemon.types.map((type) => {
                          const isSpecial = ['fire', 'electric', 'grass', 'water'].includes(type);
                          return (
                            <span key={type} className={`type-badge ${isSpecial ? 'badge-highlight' : ''}`}>
                              {type}
                            </span>
                          );
                        })}
                      </div>

                      {/* Batas Bar Status */}
                      <div className="stats-section">
                        <div className="stat-row">
                          <span>HP 💛</span>
                          <span className="stat-value">{pokemon.hp}</span>
                        </div>
                        <div className="stat-bar-bg">
                          <div className="stat-bar-fill-hp" style={{ width: `${Math.min(pokemon.hp, 100)}%` }}></div>
                        </div>

                        <div className="stat-row">
                          <span>ATTACK ⚔️</span>
                          <span className="stat-value">{pokemon.attack}</span>
                        </div>
                        <div className="stat-bar-bg">
                          <div className="stat-bar-fill-atk" style={{ width: `${Math.min(pokemon.attack, 100)}%` }}></div>
                        </div>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            )}

            {/* NAVIGASI PAGINATION BAR */}
            {totalPages > 1 && (
              <div className="pagination-container">
                <button
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                  className="page-btn"
                >
                  ◀ Prev
                </button>
                
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => handlePageChange(index + 1)}
                    className={`page-number ${currentPage === index + 1 ? 'active' : ''}`}
                  >
                    {index + 1}
                  </button>
                ))}

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                  className="page-btn"
                >
                  Next ▶
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}