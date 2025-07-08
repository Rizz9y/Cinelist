import React, { useState, useEffect } from 'react';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true);
        }
    }, []);

    const handleLoginSuccess = () => {
        setIsLoggedIn(true);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
    };

    return (
        <div style={appStyles.fullPageBackground}>
            {isLoggedIn ? (
                <HomePage onLogout={handleLogout} />
            ) : (
                <LoginPage onLoginSuccess={handleLoginSuccess} />
            )}
        </div>
    );
}

const appStyles = {
    fullPageBackground: {
        minHeight: '100vh', 
        width: '100vw',    
        backgroundImage: 'url("https://images.hdqwalls.com/download/rainy-day-with-finn-and-jake-tv-1920x1080.jpg")',
        backgroundSize: 'cover',   
        backgroundPosition: 'center', 
        backgroundRepeat: 'no-repeat', 
        backgroundColor: '#333',
    },
};

export default App;