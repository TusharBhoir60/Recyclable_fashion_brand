const router = require('express').Router();

const authRoutes = require('./auth.routes');
const productRoutes = require('./product.routes');
const customizationRoutes = require('./customisation.routes');
const orderRoutes = require('./order.routes');
const paymentRoutes = require('./payment.routes');
const reviewRoutes = require('./review.routes');
const searchRoutes = require('./search.routes'); // use './search.routes' if that is your actual filename
const adminRoutes = require('./admin.routes');

router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/customize', customizationRoutes);
router.use('/orders', orderRoutes);
router.use('/payments', paymentRoutes);
router.use('/reviews', reviewRoutes);
router.use('/search', searchRoutes);
router.use('/admin', adminRoutes);
module.exports = router;