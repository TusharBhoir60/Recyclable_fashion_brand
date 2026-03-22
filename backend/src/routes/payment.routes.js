const router = require('express').Router();
const ctrl   = require('../controller/payment.controller');
const auth   = require('../middleware/auth.middleware');

router.post('/initiate', auth, ctrl.initiatePayment);
router.post('/verify',   auth, ctrl.verifyPayment);

module.exports = router;