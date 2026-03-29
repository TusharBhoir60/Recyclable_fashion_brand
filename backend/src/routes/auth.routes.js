const router     = require('express').Router();
const rateLimit  = require('express-rate-limit');
const ctrl       = require('../controllers/auth.controller');
const auth       = require('../middleware/auth.middleware');
const validate   = require('../middleware/validate.middleware');
const {
  validateRegister,
  validateLogin,
  validateRefreshToken,
} = require('../validators/auth.validator');

// Limit repeated login / register / refresh attempts to reduce brute-force risk
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
});

router.post('/register', authLimiter, validate(validateRegister), ctrl.register);
router.post('/login',    authLimiter, validate(validateLogin), ctrl.login);
router.post('/refresh',  authLimiter, validate(validateRefreshToken), ctrl.refreshToken);
router.post('/logout',   authLimiter, auth, ctrl.logout);
router.get('/me',        auth, ctrl.getMe);
router.put('/me', authMiddleware, authController.updateMe);
module.exports = router;