const productService = require('../services/product.service');

async function listProducts(req, res, next) {
  try {
    const { type, page, limit } = req.query;
    const result = await productService.listProducts({ type, page, limit });
    res.json(result);
  } catch (err) { next(err); }
}

async function getProduct(req, res, next) {
  try {
    const product = await productService.getProduct(req.params.id);
    res.json(product);
  } catch (err) { next(err); }
}

async function createProduct(req, res, next) {
  try {
    const { name, description, type, basePrice, stock } = req.body;
    const files   = req.files || [];
    const product = await productService.createProduct({ name, description, type, basePrice, stock, files });
    res.status(201).json(product);
  } catch (err) { next(err); }
}

module.exports = { listProducts, getProduct, createProduct };