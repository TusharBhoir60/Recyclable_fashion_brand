const router = require('express').Router();
const ctrl   = require('../controller/customization.controller');
const auth   = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

router.post('/', auth, upload.single('image'), ctrl.createcustomization);

module.exports = router;
