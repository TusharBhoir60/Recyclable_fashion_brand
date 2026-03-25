const jwt = require('jsonwebtoken');

const SECRET_KEY = "mysecretkey";

function verifyToken(token) {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (err) {
    return null;
  }
}

module.exports = { verifyToken };