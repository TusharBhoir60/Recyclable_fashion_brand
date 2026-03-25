const router     = require('express').Router();
const rateLimit  = require('express-rate-limit');
const ctrl       = require('../controller/auth.controller');
const auth       = require('../middleware/auth.middleware');

// Limit repeated login / register / refresh attempts to reduce brute-force risk
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
});

router.post('/register', authLimiter, ctrl.register);
router.post('/login',    authLimiter, ctrl.login);
router.post('/refresh',  authLimiter, ctrl.refreshToken);
router.post('/logout',   authLimiter, auth, ctrl.logout);
router.get('/me',        auth, ctrl.getMe);

module.exports = router;