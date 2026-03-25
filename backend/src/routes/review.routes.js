const router = require('express').Router();
const ctrl   = require('../controllers/review.controller');
const auth   = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const { validateCreateReview } = require('../validators/review.validator');

router.post('/',             auth, validate(validateCreateReview), ctrl.createReview);
router.get('/:productId',         ctrl.getReviews);

module.exports = router;