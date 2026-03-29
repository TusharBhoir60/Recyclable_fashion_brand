const bcrypt = require('bcryptjs');
const prisma = require('../utils/prisma');
const { signToken, signRefreshToken, verifyRefreshToken } = require('../utils/jwt');

// ================= REGISTER =================
async function register({ name, email, password, role }) {
  // Check if user already exists
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw Object.assign(new Error('Email already registered'), { status: 400 });
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: role || 'USER',
    },
  });

  // Remove password from response
  const { password: _pw, ...safeUser } = user;

  // Generate tokens
  const accessToken = signToken({ id: user.id, role: user.role });
  const refreshToken = signRefreshToken({ id: user.id });

  return { user: safeUser, accessToken, refreshToken };
}

// ================= LOGIN =================
async function login({ email, password }) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw Object.assign(new Error('Invalid credentials'), { status: 401 });
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    throw Object.assign(new Error('Invalid credentials'), { status: 401 });
  }

  // Update last login time
  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });

  const { password: _pw, ...safeUser } = user;

  const accessToken = signToken({ id: user.id, role: user.role });
  const refreshToken = signRefreshToken({ id: user.id });

  return { user: safeUser, accessToken, refreshToken };
}

// ================= REFRESH =================
async function refresh(refreshToken) {
  let payload;

  try {
    payload = verifyRefreshToken(refreshToken);
  } catch (err) {
    const reason =
      err.name === 'TokenExpiredError'
        ? 'Refresh token expired'
        : 'Invalid refresh token';

    throw Object.assign(new Error(reason), { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.id },
    select: { id: true, role: true },
  });

  if (!user) {
    throw Object.assign(new Error('User not found'), { status: 401 });
  }

  const newAccessToken = signToken({ id: user.id, role: user.role });
  const newRefreshToken = signRefreshToken({ id: user.id });

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
}

module.exports = { register, login, refresh };