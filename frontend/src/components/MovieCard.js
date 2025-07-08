import React from 'react';

function MovieCard({ movie, onMovieClick }) {
    return (
        <div style={styles.card} onClick={() => onMovieClick(movie.imdbID)}>
            <img src={movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450?text=No+Poster'} alt={movie.Title} style={styles.poster} />
            <div style={styles.info}>
                <h3 style={styles.title}>{movie.Title}</h3>
                <p style={styles.year}>{movie.Year}</p>
            </div>
        </div>
    );
}

const styles = {
    card: {
        border: '1px solid rgba(255, 255, 255, 0.18)', 
        borderRadius: '15px', 
        overflow: 'hidden',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)', 
        backgroundColor: 'rgba(255, 255, 255, 0.25)', 
        backdropFilter: 'blur(8px)', 
        width: '200px',
        margin: '10px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        cursor: 'pointer',
        transition: 'transform 0.2s ease-in-out',
        color: '#fff', 
        textShadow: '0 1px 2px rgba(0,0,0,0.5)', 
    },
    cardHover: {
        transform: 'scale(1.03)',
    },
    poster: {
        width: '100%',
        height: '300px',
        objectFit: 'cover',
        borderTopLeftRadius: '15px',
        borderTopRightRadius: '15px',
    },
    info: {
        padding: '15px',
    },
    title: {
        fontSize: '1.1em',
        margin: '0 0 5px 0',
        color: '#fff', 
    },
    year: {
        fontSize: '0.9em',
        color: '#eee', 
    }
};

export default MovieCard;