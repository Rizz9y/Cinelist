const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { testDbConnection } = require('./config/db');
const authRoutes = require('./routes/auth');
const { protect } = require('./middleware/authMiddleware');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

testDbConnection();


app.use('/api/auth', authRoutes);

app.get('/api/movies/test', async (req, res) => {
    try {
        const apiKey = process.env.OMDB_API_KEY;
        const response = await fetch(`http://www.omdbapi.com/?i=tt3896198&apikey=${apiKey}`);
        const data = await response.json();
        res.json({ message: 'Koneksi OMDb API berhasil!', data });
    } catch (error) {
        console.error('Error in /api/movies/test:', error);
        res.status(500).json({ error: 'Gagal terhubung ke OMDb API', details: error.message });
    }
});

app.get('/api/movies/search', async (req, res) => {
    const { s } = req.query;
    if (!s) {
        return res.status(400).json({ message: 'Parameter pencarian (s) diperlukan.' });
    }
    try {
        const apiKey = process.env.OMDB_API_KEY;
        const response = await fetch(`http://www.omdbapi.com/?s=${encodeURIComponent(s)}&apikey=${apiKey}`);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error fetching movies from OMDb (search):', error);
        res.status(500).json({ message: 'Gagal mengambil data film dari OMDb API.' });
    }
});

app.get('/api/movies/details', async (req, res) => {
    const { t, i } = req.query; 

    if (!t && !i) {
        return res.status(400).json({ message: 'Parameter judul (t) atau ID (i) diperlukan.' });
    }
    try {
        const apiKey = process.env.OMDB_API_KEY;
        let url = `http://www.omdbapi.com/?apikey=${apiKey}`;
        if (t) {
            url += `&t=${encodeURIComponent(t)}`;
        } else if (i) {
            url += `&i=${encodeURIComponent(i)}`;
        }

        const response = await fetch(url);
        const data = await response.json();

        if (data.Response === "True") {
            res.json(data);
        } else {
            res.status(404).json({ message: data.Error || 'Film tidak ditemukan di OMDb.' });
        }
    } catch (error) {
        console.error('Error in /api/movies/details:', error);
        res.status(500).json({ message: 'Gagal mengambil detail film dari OMDb API.' });
    }
});

app.get('/api/protected', protect, (req, res) => {
    res.json({ message: `Anda berhasil mengakses rute yang dilindungi, user ID: ${req.user}` });
});

app.listen(port, () => {
    console.log(`Backend server berjalan di http://localhost:${port}`);
});