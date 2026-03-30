const productService = require('../services/product.service');

const toDto = (p) => ({
  id: p.id,
  name: p.name,
  description: p.description,
  type: p.type,
  price: p.basePrice,          // FE-friendly alias
  basePrice: p.basePrice,
  stock: p.stock,
  images: p.images || [],
  image: p.images?.[0] || '',
  isActive: p.isActive,
  createdAt: p.createdAt,
  updatedAt: p.updatedAt,
});

const listProducts = async (req, res, next) => {
  try {
    const { type, page = 1, limit = 12 } = req.query;
    const result = await productService.listProducts({ type, page: Number(page), limit: Number(limit) });

    return res.status(200).json({
      success: true,
      data: {
        products: result.products.map(toDto),
        total: result.total,
        page: result.page,
        limit: result.limit,
      },
    });
  } catch (e) {
    next(e);
  }
};

const getProductById = async (req, res, next) => {
  try {
    const product = await productService.getProduct(req.params.id);
    return res.status(200).json({ success: true, data: { product: toDto(product) } });
  } catch (e) {
    next(e);
  }
};

// Prisma model has no slug now — keep route for compatibility but return clear message
const getProductBySlug = async (req, res) => {
  return res.status(400).json({
    success: false,
    message: 'Slug lookup not supported. Use /products/id/:id',
  });
};

// Legacy route: treat /:id as id
const getProduct = async (req, res, next) => {
  return getProductById(req, res, next);
};

const createProduct = async (req, res, next) => {
  try {
    const { name, description, type, basePrice, stock } = req.body;
    const files = req.files || [];

    const product = await productService.createProduct({
      name,
      description,
      type,
      basePrice,
      stock,
      files,
    });

    return res.status(201).json({ success: true, data: { product: toDto(product) } });
  } catch (e) {
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