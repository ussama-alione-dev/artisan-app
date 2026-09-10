// auth.js — JWT sign / verify helpers
const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || 'artisan-secret-key';

function signToken(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: '7d' });
}

function verifyToken(token) {
  return jwt.verify(token, SECRET); // throws if invalid
}

module.exports = { signToken, verifyToken };
