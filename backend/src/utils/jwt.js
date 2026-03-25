const jwt    = require('jsonwebtoken');
const crypto = require('crypto');
const env = require('../config/env');

const ACCESS_SECRET  = env.jwt.accessSecret;
const ACCESS_EXPIRES = env.jwt.accessExpiresIn;

const REFRESH_SECRET  = env.jwt.refreshSecret;
const REFRESH_EXPIRES = env.jwt.refreshExpiresIn;

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