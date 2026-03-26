const router  = require('express').Router();
const ctrl    = require('../controllers/product.controller');
const auth    = require('../middleware/auth.middleware');
const isAdmin = require('../middleware/isadmin.middleware');
const upload  = require('../middleware/upload.middleware');
const validate = require('../middleware/validate.middleware');
const { validateCreateProduct } = require('../validators/product.validator');

router.get('/',    ctrl.listProducts);
router.get('/:id', ctrl.getProduct);
router.post('/',   auth, isAdmin, upload.array('images', 10), validate(validateCreateProduct), ctrl.createProduct);

module.exports = router;