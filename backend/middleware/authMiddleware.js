const jwt = require('jsonwebtoken');
require('dotenv').config();

const protect = (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded.id;
            next();
        } catch (error) {
            res.status(401).json({ message: 'Tidak diotorisasi, token gagal.' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Tidak diotorisasi, tidak ada token.' });
    }
};

module.exports = { protect };