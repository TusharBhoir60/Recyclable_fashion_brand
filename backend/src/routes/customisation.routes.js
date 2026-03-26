const router = require('express').Router();
const ctrl   = require('../controllers/cusomisation.controller');
const auth   = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

router.post('/', auth, upload.single('image'), ctrl.createCustomisation);

module.exports = router;