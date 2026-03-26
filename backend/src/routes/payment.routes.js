const router = require('express').Router();
const ctrl   = require('../controllers/payment.controller');
const auth   = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const {
  validateInitiatePayment,
  validateVerifyPayment,
} = require('../validators/payment.validator');

router.post('/initiate', auth, validate(validateInitiatePayment), ctrl.initiatePayment);
router.post('/verify',   auth, validate(validateVerifyPayment), ctrl.verifyPayment);

module.exports = router;