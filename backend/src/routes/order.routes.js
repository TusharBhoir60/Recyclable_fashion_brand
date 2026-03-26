const router = require('express').Router();
const ctrl   = require('../controllers/order.controller');
const auth   = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const { validateCreateOrder } = require('../validators/order.validator');

router.post('/',   auth, validate(validateCreateOrder), ctrl.createOrder);
router.get('/',    auth, ctrl.getUserOrders);
router.get('/:id', auth, ctrl.getOrderById);

module.exports = router;