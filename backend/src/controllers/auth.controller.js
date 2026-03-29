const authService = require('../services/auth.service');
const prisma      = require('../utils/prisma');

async function register(req, res, next) {
  try {
    const result = await authService.register(req.body);
    res.status(201).json(result);
  } catch (err) { next(err); }
}

async function login(req, res, next) {
  try {
    const result = await authService.login(req.body);
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
  res.json({ message: 'Logged out successfully' });
}

async function getMe(req, res, next) {
  try {
    const user = await prisma.user.findUnique({
      where:  { id: req.user.id },
      select: { id: true, name: true, email: true, role: true, segment: true, phone: true, address: true, createdAt: true },
    });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) { next(err); }
}

async function updateMe(req, res, next) {
  try {
    const { name, phone, address } = req.body || {};

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        ...(name !== undefined ? { name } : {}),
        ...(phone !== undefined ? { phone } : {}),
        ...(address !== undefined ? { address } : {}),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        segment: true,
        phone: true,
        address: true,
        createdAt: true,
      },
    });

    res.json({ user });
  } catch (err) { next(err); }
}

module.exports = { register, login, refreshToken, logout, getMe, updateMe };