const router = require('express').Router();
const ctrl   = require('../controller/review.controller');
const auth   = require('../middleware/auth.middleware');

router.post('/',             auth, ctrl.createReview);
router.get('/:productId',         ctrl.getReviews);

module.exports = router;