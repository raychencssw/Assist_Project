const jwt = require('jsonwebtoken');
const config = require('./config');

function verifyToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    console.log("authHeader in verifyToken: ", authHeader);
    const token = authHeader && authHeader.split(' ')[1];
        
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    jwt.verify(token, config.secretKey, (err, decoded) => {
        if (err) {
        return res.status(401).json({ message: 'Invalid token' });
        }

        req.userId = decoded.id;
        next();
    });
}

module.exports = verifyToken;