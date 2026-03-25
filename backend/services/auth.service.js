const jwt = require('jsonwebtoken');

const SECRET_KEY = "mysecretkey";

// ✅ GLOBAL (shared everywhere)
let users = [];

// Register
function register({ name, email, password }) {
  const user = {
    id: users.length + 1,
    name,
    email,
    password
  };

  users.push(user);
  return user;
}

// Login
function login({ email, password }) {
 

  const user = users.find(
    u => u.email === email && u.password === password
  );


  if (!user) return null;

  const token = jwt.sign(
    { id: user.id, email: user.email },
    SECRET_KEY,
    { expiresIn: "1h" }
  );

  return token;
}

module.exports = {
  register,
  login
};