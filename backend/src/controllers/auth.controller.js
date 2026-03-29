const authService = require('../services/auth.service');
const prisma      = require('../utils/prisma');

async function register(req, res, next) {
  try {
    const result = await authService.register(req.body);
    console.log(`[AUTH] User registered: ${result.user.email} (ID: ${result.user.id})`);
    res.status(201).json(result);
  } catch (err) { next(err); }
}

async function login(req, res, next) {
  try {
    const result = await authService.login(req.body);
    console.log(`[AUTH] User logged in: ${result.user.email} (ID: ${result.user.id})`);
    res.json(result);
  } catch (err) { next(err); }
}

async function refreshToken(req, res, next) {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ error: 'refreshToken required' });
    const tokens = await authService.refresh(refreshToken);
    res.json(tokens);
  } catch (err) { next(err); }
}

async function logout(req, res) {
  console.log(`[AUTH] User logged out: ${req.user.email} (ID: ${req.user.id})`);
  // TODO (Sprint 1): When Redis is added, blocklist req.user's refresh token jti here
  // using the jti claim stored in the refresh token so it cannot be reused before expiry.
  res.json({ message: 'Logged out successfully' });
}

async function getMe(req, res, next) {
  try {
    const user = await prisma.user.findUnique({
      where:  { id: req.user.id },
      select: { id: true, name: true, email: true, role: true, segment: true, createdAt: true },
    });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) { next(err); }
}

module.exports = { register, login, refreshToken, logout, getMe };