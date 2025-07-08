import React, { useEffect, useState } from 'react';
import backendApi from '../api';
import MovieCard from '../components/MovieCard';
import MovieDetailsPopup from '../components/MovieDetailsPopup';

function HomePage({ onLogout }) {
    const [movies, setMovies] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [selectedMovieId, setSelectedMovieId] = useState(null);

    const defaultMoviesImdbIDs = [
        "tt15398776", 
        "tt15172688", // Barbie
        "tt9362722",  // Spider-Man: Across the Spider-Verse
        "tt10366206", // John Wick: Chapter 4
        "tt6718170",  // The Super Mario Bros. Movie
        "tt1745960",  // Top Gun: Maverick
        "tt1630029",  // Avatar: The Way of Water
        "tt9114286",  // Black Panther: Wakanda Forever
        "tt1877830",  // The Batman
        "tt10872600", // Spider-Man: No Way Home
        "tt1160419",  // Dune
        "tt9389998",  // Shang-Chi and the Legend of the Ten Rings
        "tt2953250",  // Encanto
        "tt6723592",  // Tenet
        "tt3460252",  // Soul
        "tt1051906",  // The Invisible Man
        "tt4154796",  // Avengers: Endgame
        "tt7286456",  // Joker
        "tt4520988",  // Frozen II
        "tt6710474"   // Parasite
    ];

    const fetchMovieDetailsFromBackend = async (id) => {
        setLoading(true);
        setError('');
        console.log(`[fetchMovieDetailsFromBackend] Fetching for ID: ${id}`);
        try {
            const response = await backendApi.get(`/api/movies/details?i=${encodeURIComponent(id)}`);
            if (response.data.Response === "True") {
                console.log(`[fetchMovieDetailsFromBackend] Success for ID ${id}:`, response.data.Title);
                return response.data;
            } else {
                console.warn(`[fetchMovieDetailsFromBackend] Film with ID "${id}" not found or error from OMDb:`, response.data.Error);
                return null;
            }
        } catch (err) {
            console.error(`[fetchMovieDetailsFromBackend] Network/API Error for ID "${id}":`, err);
            return null;
        } finally {
            setLoading(false);
        }
    };

    const loadDefaultMovies = async () => {
        console.log('[loadDefaultMovies] Starting to load default movies by ID...');
        setLoading(true);
        setError('');
        const fetchedMovies = [];
        const moviePromises = defaultMoviesImdbIDs.map(id => fetchMovieDetailsFromBackend(id));
        const results = await Promise.all(moviePromises);

        for (const movie of results) {
            if (movie && movie.Poster && movie.Poster !== 'N/A') {
                fetchedMovies.push(movie);
                console.log(`[loadDefaultMovies] Added: ${movie.Title}`);
            } 
        }
        setMovies(fetchedMovies);
        setLoading(false);
        console.log(`[loadDefaultMovies] Finished. Total movies fetched: ${fetchedMovies.length}`);
        if (fetchedMovies.length === 0 && defaultMoviesImdbIDs.length > 0) {
            setError('Gagal memuat beberapa film default. Periksa konsol untuk detail.');
        } 
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        const trimmedSearchTerm = searchTerm.trim();

        if (trimmedSearchTerm === '') {
            loadDefaultMovies();
            return;
        }

        setLoading(true);
        setError('');
        try {
            const response = await backendApi.get(`/api/movies/search?s=${encodeURIComponent(trimmedSearchTerm)}`);
            if (response.data.Response === "True") {
                setMovies(response.data.Search);
            } else {
                setMovies([]);
                setError(response.data.Error || 'Film tidak ditemukan.');
            }
        } catch (err) {
            console.error('Error fetching movies from backend search:', err);
            setError('Gagal mengambil data film dari backend. Coba lagi nanti.');
            setMovies([]);
        } finally {
            setLoading(false);
        }
    };

    const handleMovieClick = (imdbId) => {
        setSelectedMovieId(imdbId);
    };

    const handleClosePopup = () => {
        setSelectedMovieId(null);
    };

    useEffect(() => {
        loadDefaultMovies();
    }, []);


    return (
        <div style={styles.mainContent}>
            <div style={styles.header}>
                <h1 style={styles.heading}>Cinelist</h1>
                <button onClick={onLogout} style={styles.logoutButton}>Logout</button>
            </div>

            <form onSubmit={handleSearch} style={styles.searchForm}>
                <input
                    type="text"
                    placeholder="Cari film..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={styles.searchInput}
                />
                <button type="submit" style={styles.searchButton}>Cari</button>
            </form>

            {loading && <p style={styles.message}>Memuat film...</p>}
            {error && <p style={styles.errorMessage}>{error}</p>}

            <div style={styles.movieGrid}>
                {movies.length > 0 ? (
                    movies.map((movie) => (
                        <MovieCard
                            key={movie.imdbID}
                            movie={movie}
                            onMovieClick={handleMovieClick}
                        />
                    ))
                ) : (
                    !loading && !error && <p style={styles.message}>Tidak ada film untuk ditampilkan.</p>
                )}
            </div>

            {selectedMovieId && (
                <MovieDetailsPopup
                    movieId={selectedMovieId}
                    onClose={handleClosePopup}
                />
            )}
        </div>
    );
}

const styles = {
    mainContent: {
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
        minHeight: '100vh',
        color: '#fff', 
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.2)', 
        paddingBottom: '15px',
        backdropFilter: 'blur(3px)', 
        backgroundColor: 'rgba(0, 0, 0, 0.1)', 
        borderRadius: '8px',
        padding: '10px 20px',
        boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
    },
    heading: {
        color: '#fff', 
        margin: 0,
        textShadow: '0 2px 4px rgba(0,0,0,0.5)',
    },
    logoutButton: {
        backgroundColor: '#dc3545',
        color: 'white',
        padding: '8px 15px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '1em',
        transition: 'background-color 0.3s ease',
    },
    searchForm: {
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '30px',
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        backdropFilter: 'blur(5px)',
        borderRadius: '10px',
        padding: '10px 20px',
        boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
    },
    searchInput: {
        width: '50%',
        padding: '10px',
        border: '1px solid rgba(255, 255, 255, 0.3)', 
        borderRadius: '5px 0 0 5px',
        fontSize: '1em',
        backgroundColor: 'rgba(255, 255, 255, 0.1)', 
        color: '#fff', 
        outline: 'none',
        '::placeholder': {
            color: 'rgba(255, 255, 255, 0.7)',
        },
    },
    searchButton: {
        backgroundColor: '#007bff',
        color: 'white',
        padding: '10px 15px',
        border: 'none',
        borderRadius: '0 5px 5px 0',
        cursor: 'pointer',
        fontSize: '1em',
        transition: 'background-color 0.3s ease',
    },
    movieGrid: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '20px',
    },
    message: {
        textAlign: 'center',
        color: '#fff', 
        fontSize: '1.2em',
        marginTop: '50px',
        textShadow: '0 1px 2px rgba(0,0,0,0.5)',
    },
    errorMessage: {
        textAlign: 'center',
        color: '#ffdddd', 
        fontSize: '1.2em',
        marginTop: '50px',
        textShadow: '0 1px 2px rgba(0,0,0,0.5)',
    }
};

export default HomePage;