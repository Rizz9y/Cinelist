import React, { useEffect, useState } from 'react';
import backendApi from '../api';

function MovieDetailsPopup({ movieId, onClose }) {
    const [movieDetails, setMovieDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDetails = async () => {
            setLoading(true);
            setError('');
            try {
                const response = await backendApi.get(`/api/movies/details?i=${movieId}`);
                if (response.data.Response === "True") {
                    setMovieDetails(response.data);
                } else {
                    setError(response.data.Error || 'Detail film tidak ditemukan.');
                }
            } catch (err) {
                console.error('Error fetching movie details for popup:', err);
                setError('Gagal memuat detail film. Coba lagi nanti.');
            } finally {
                setLoading(false);
            }
        };

        if (movieId) {
            fetchDetails();
        }
    }, [movieId]);

    if (!movieId) {
        return null;
    }

    return (
        <div style={styles.overlay}>
            <div style={styles.popup}>
                <button onClick={onClose} style={styles.closeButton}>X</button>
                {loading && <p style={styles.message}>Memuat detail film...</p>}
                {error && <p style={styles.errorMessage}>{error}</p>}
                {movieDetails && (
                    <div style={styles.detailsContent}>
                        <h2 style={styles.title}>{movieDetails.Title} ({movieDetails.Year})</h2>
                        <div style={styles.headerSection}>
                            <img src={movieDetails.Poster !== 'N/A' ? movieDetails.Poster : 'https://via.placeholder.com/300x450?text=No+Poster'} alt={movieDetails.Title} style={styles.poster} />
                            <div style={styles.infoColumn}>
                                <p><strong>Genre:</strong> {movieDetails.Genre}</p>
                                <p><strong>Director:</strong> {movieDetails.Director}</p>
                                <p><strong>Actors:</strong> {movieDetails.Actors}</p>
                                <p><strong>Runtime:</strong> {movieDetails.Runtime}</p>
                                <p><strong>Rating IMDb:</strong> {movieDetails.imdbRating} ({movieDetails.imdbVotes} votes)</p>
                                {movieDetails.Ratings && movieDetails.Ratings.map((rating, index) => (
                                    <p key={index}><strong>{rating.Source}:</strong> {rating.Value}</p>
                                ))}
                            </div>
                        </div>
                        <p style={styles.plot}><strong>Plot:</strong> {movieDetails.Plot}</p>
                        <p><strong>Awards:</strong> {movieDetails.Awards}</p>
                        <p><strong>Box Office:</strong> {movieDetails.BoxOffice}</p>
                        <p><strong>Country:</strong> {movieDetails.Country}</p>
                        <p><strong>Language:</strong> {movieDetails.Language}</p>
                    </div>
                )}
            </div>
        </div>
    );
}

const styles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    popup: {
        backgroundColor: '#fff',
        padding: '30px',
        borderRadius: '10px',
        boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)',
        maxWidth: '800px',
        maxHeight: '90vh',
        overflowY: 'auto',
        position: 'relative',
        fontFamily: 'Arial, sans-serif',
        color: '#333',
    },
    closeButton: {
        position: 'absolute',
        top: '15px',
        right: '15px',
        backgroundColor: '#dc3545',
        color: 'white',
        border: 'none',
        borderRadius: '50%',
        width: '30px',
        height: '30px',
        fontSize: '1em',
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    message: {
        textAlign: 'center',
        color: '#555',
        fontSize: '1.1em',
    },
    errorMessage: {
        textAlign: 'center',
        color: 'red',
        fontSize: '1.1em',
    },
    detailsContent: {
        marginTop: '20px',
    },
    title: {
        textAlign: 'center',
        marginBottom: '20px',
        color: '#007bff',
    },
    headerSection: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '20px',
        marginBottom: '20px',
    },
    poster: {
        maxWidth: '200px',
        height: 'auto',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
    },
    infoColumn: {
        flex: 1,
        textAlign: 'left',
        width: '100%',
    },
    plot: {
        lineHeight: '1.6',
        marginTop: '20px',
        marginBottom: '15px',
    },
    '@media (min-width: 768px)': {
        headerSection: {
            flexDirection: 'row',
            alignItems: 'flex-start',
        },
        infoColumn: {
            width: 'auto',
        }
    }
};

export default MovieDetailsPopup;