const mongoose = require('mongoose');
const Product = require('../models/product.model');

const toDto = (p) => ({
  id: String(p._id),
  name: p.name,
  slug: p.slug,
  description: p.description,
  price: p.price,
  images: p.images || [],
  image: p.images?.[0] || '',
  category: p.category || '',
  artisan_name: p.artisan_name || '',
  createdAt: p.createdAt,
  updatedAt: p.updatedAt,
});

const listProducts = async (req, res, next) => {
  try {
    const items = await Product.find({ is_deleted: false }).sort({ createdAt: -1 }).lean();
    return res.status(200).json({
      success: true,
      data: { products: items.map(toDto) },
    });
  } catch (e) {
    next(e);
  }
};

const getProductBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const item = await Product.findOne({ slug: String(slug).toLowerCase(), is_deleted: false }).lean();

    if (!item) return res.status(404).json({ success: false, message: 'Product not found' });

    return res.status(200).json({ success: true, data: { product: toDto(item) } });
  } catch (e) {
    next(e);
  }
};

const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid product id' });
    }

    const item = await Product.findOne({ _id: id, is_deleted: false }).lean();
    if (!item) return res.status(404).json({ success: false, message: 'Product not found' });

    return res.status(200).json({ success: true, data: { product: toDto(item) } });
  } catch (e) {
    next(e);
  }
};

// Backward compatible single route: /:value
const getProduct = async (req, res, next) => {
  try {
    const { id } = req.params; // existing param name

    if (mongoose.Types.ObjectId.isValid(id)) return getProductById(req, res, next);

    req.params.slug = id;
    return getProductBySlug(req, res, next);
  } catch (e) {
    next(e);
  }
};

const createProduct = async (req, res, next) => {
  try {
    const payload = req.body;
    const created = await Product.create({
      name: payload.name,
      slug: payload.slug,
      description: payload.description || '',
      price: Number(payload.price || 0),
      images: payload.images || [],
      category: payload.category || '',
      artisan_name: payload.artisan_name || '',
    });

    return res.status(201).json({ success: true, data: { product: toDto(created) } });
  } catch (e) {
    if (e?.code === 11000) {
      return res.status(409).json({ success: false, message: 'Slug already exists' });
    }
    next(e);
  }
};

module.exports = {
  listProducts,
  getProduct,
  getProductBySlug,
  getProductById,
  createProduct,
};