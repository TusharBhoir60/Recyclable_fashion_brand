const router  = require('express').Router();
const ctrl    = require('../controller/product.controller');
const auth    = require('../middleware/auth.middleware');
const isAdmin = require('../middleware/isAdmin.middleware');
const upload  = require('../middleware/upload.middleware');

router.get('/',    ctrl.listProducts);
router.get('/:id', ctrl.getProduct);
router.post('/',   auth, isAdmin, upload.array('images', 10), ctrl.createProduct);

module.exports = router;