function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function isEmail(value) {
  return isNonEmptyString(value) && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function validateRegister(req) {
  const { name, email, password } = req.body || {};
  const errors = [];

  if (!isNonEmptyString(name)) errors.push('name is required');
  if (!isEmail(email)) errors.push('valid email is required');
  if (!isNonEmptyString(password) || password.length < 8) {
    errors.push('password must be at least 8 characters');
  }

  return errors;
}

function validateLogin(req) {
  const { email, password } = req.body || {};
  const errors = [];

  if (!isEmail(email)) errors.push('valid email is required');
  if (!isNonEmptyString(password)) errors.push('password is required');

  return errors;
}

function validateRefreshToken(req) {
  const { refreshToken } = req.body || {};
  const errors = [];

  if (!isNonEmptyString(refreshToken)) errors.push('refreshToken is required');

  return errors;
}

module.exports = { validateRegister, validateLogin, validateRefreshToken };
