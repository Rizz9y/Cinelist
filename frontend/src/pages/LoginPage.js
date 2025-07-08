import React, { useState } from 'react';
import backendApi from '../api';

function LoginPage({ onLoginSuccess }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isRegister, setIsRegister] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        try {
            const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';
            const response = await backendApi.post(endpoint, { username, password });
            setMessage(response.data.message);
            if (!isRegister && response.data.token) {
                localStorage.setItem('token', response.data.token);
                onLoginSuccess();
            }
            setUsername('');
            setPassword('');
        } catch (error) {
            setMessage(error.response?.data?.message || 'Terjadi kesalahan.');
        }
    };

    return (
        <div style={styles.outerContainer}> {}
            <div style={styles.container}>
                <h1 style={styles.webTitle}>Cinelist</h1>
                <h2 style={styles.heading}>{isRegister ? 'Daftar Akun Baru' : 'Login'}</h2>
                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.formGroup}>
                        <label htmlFor="username" style={styles.label}>Username:</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            style={styles.input}
                        />
                    </div>
                    <div style={styles.formGroup}>
                        <label htmlFor="password" style={styles.label}>Password:</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={styles.input}
                        />
                    </div>
                    <button type="submit" style={styles.button}>
                        {isRegister ? 'Daftar' : 'Login'}
                    </button>
                </form>
                {message && <p style={styles.message}>{message}</p>}
                <button
                    onClick={() => setIsRegister(!isRegister)}
                    style={styles.toggleButton}
                >
                    {isRegister ? 'Sudah punya akun? Login' : 'Belum punya akun? Daftar'}
                </button>
            </div>
        </div>
    );
}

const styles = {
    outerContainer: {
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        maxWidth: '500px',
        width: '90%',
        padding: '30px',
        borderRadius: '15px',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.18)',
        fontFamily: 'Arial, sans-serif',
        color: '#fff',
        textAlign: 'center',
    },
    webTitle: {
        fontSize: '2.5em',
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: '20px',
        textShadow: '0 3px 6px rgba(0,0,0,0.6)',
    },
    heading: {
        textAlign: 'center',
        color: '#fff',
        marginBottom: '25px',
        textShadow: '0 2px 4px rgba(0,0,0,0.5)',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
    },
    formGroup: {
        marginBottom: '20px',
        textAlign: 'left',
    },
    label: {
        display: 'block',
        marginBottom: '8px',
        color: '#eee',
        fontWeight: 'bold',
        textShadow: '0 1px 2px rgba(0,0,0,0.5)',
    },
    input: {
        width: 'calc(100% - 24px)',
        padding: '12px',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        borderRadius: '8px',
        fontSize: '16px',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        color: '#fff',
        outline: 'none',
        '::placeholder': {
            color: 'rgba(255, 255, 255, 0.7)',
        },
    },
    button: {
        backgroundColor: '#007bff',
        color: 'white',
        padding: '12px 15px',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '17px',
        marginTop: '20px',
        transition: 'background-color 0.3s ease',
    },
    buttonHover: {
        backgroundColor: '#0056b3',
    },
    message: {
        textAlign: 'center',
        marginTop: '25px',
        color: '#ffdddd',
        fontWeight: 'bold',
        textShadow: '0 1px 2px rgba(0,0,0,0.5)',
    },
    toggleButton: {
        background: 'none',
        border: 'none',
        color: '#a0c8ff',
        cursor: 'pointer',
        marginTop: '20px',
        textAlign: 'center',
        display: 'block',
        width: '100%',
        fontSize: '15px',
        textDecoration: 'underline',
    }
};

export default LoginPage;