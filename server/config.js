require('dotenv').config();

module.exports = {
    secretKey: env.JWT_SECRET,
    expiresIn: JWT_EXPIRE // Token expiration time
};