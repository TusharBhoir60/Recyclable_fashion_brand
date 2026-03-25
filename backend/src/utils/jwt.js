const jwt    = require('jsonwebtoken');
const crypto = require('crypto');

const ACCESS_SECRET  = process.env.JWT_SECRET;
const ACCESS_EXPIRES = process.env.JWT_EXPIRES_IN         || '15m';

const REFRESH_SECRET  = process.env.JWT_REFRESH_SECRET;
const REFRESH_EXPIRES = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

if (!ACCESS_SECRET)  throw new Error('JWT_SECRET environment variable is required');
if (!REFRESH_SECRET) throw new Error('JWT_REFRESH_SECRET environment variable is required');

function signToken(payload) {
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: ACCESS_EXPIRES });
}

function verifyToken(token) {
  return jwt.verify(token, ACCESS_SECRET);
}

function signRefreshToken(payload) {
  // Include a unique jti (JWT ID) to enable Redis-based revocation in a future sprint
  return jwt.sign(
    { id: payload.id, jti: crypto.randomUUID() },
    REFRESH_SECRET,
    { expiresIn: REFRESH_EXPIRES }
  );
}

function verifyRefreshToken(token) {
  return jwt.verify(token, REFRESH_SECRET);
}

module.exports = { signToken, verifyToken, signRefreshToken, verifyRefreshToken };