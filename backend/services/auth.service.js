// services/auth.service.js

let users = [];

function register(user) {
  const newUser = {
    id: users.length + 1,
    ...user
  };
  users.push(newUser);
  return newUser;
}

function login(email, password) {
  return users.find(u => u.email === email && u.password === password);
}

module.exports = {
  register,
  login
};
