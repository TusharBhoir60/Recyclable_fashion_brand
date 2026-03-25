const bcrypt        = require('bcryptjs');
const prisma        = require('../utils/prisma');
const { signToken, signRefreshToken, verifyRefreshToken } = require('../utils/jwt');

async function register({ name, email, password }) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw Object.assign(new Error('Email already registered'), { status: 409 });

  const hashed = await bcrypt.hash(password, 12);
  const user   = await prisma.user.create({
    data:   { name, email, password: hashed },
    select: { id: true, name: true, email: true, role: true, segment: true },
  });

  const accessToken  = signToken({ id: user.id, role: user.role });
  const refreshToken = signRefreshToken({ id: user.id });
  return { user, accessToken, refreshToken };
}

async function login({ email, password }) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw Object.assign(new Error('Invalid credentials'), { status: 401 });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid)  throw Object.assign(new Error('Invalid credentials'), { status: 401 });

  const { password: _pw, ...safeUser } = user;
  const accessToken  = signToken({ id: user.id, role: user.role });
  const refreshToken = signRefreshToken({ id: user.id });
  return { user: safeUser, accessToken, refreshToken };
}

async function refresh(refreshToken) {
  let payload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch (err) {
    const reason = err.name === 'TokenExpiredError' ? 'Refresh token expired' : 'Invalid refresh token';
    throw Object.assign(new Error(reason), { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where:  { id: payload.id },
    select: { id: true, role: true },
  });
  if (!user) throw Object.assign(new Error('User not found'), { status: 401 });

  const newAccessToken  = signToken({ id: user.id, role: user.role });
  const newRefreshToken = signRefreshToken({ id: user.id });
  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
}

module.exports = { register, login, refresh };