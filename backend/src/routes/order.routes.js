const router = require('express').Router();
const ctrl   = require('../controller/order.controller');
const auth   = require('../middleware/auth.middleware');

router.post('/',   auth, ctrl.createOrder);
router.get('/',    auth, ctrl.getUserOrders);
router.get('/:id', auth, ctrl.getOrderById);

module.exports = router;