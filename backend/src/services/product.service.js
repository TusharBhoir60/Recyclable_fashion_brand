const prisma           = require('../utils/prisma');
const { uploadBuffer } = require('../utils/claudinary');
const visualSearch     = require('./visualsearch.service');

async function listProducts({ type, page = 1, limit = 12 }) {
  const where = { isActive: true };
  if (type) where.type = type;

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      skip:    (page - 1) * Number(limit),
      take:    Number(limit),
      orderBy: { createdAt: 'desc' },
    }),
    prisma.product.count({ where }),
  ]);

  return { products, total, page: Number(page), limit: Number(limit) };
}

async function getProduct(id) {
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) throw Object.assign(new Error('Product not found'), { status: 404 });
  return product;
}

async function createProduct({ name, description, type, basePrice, stock, files }) {
  const imageUrls = await Promise.all(
    files.map(f => uploadBuffer(f.buffer, 'products'))
  );

  const product = await prisma.product.create({
    data: { name, description, type, basePrice: Number(basePrice), stock: Number(stock), images: imageUrls },
  });

  // Index first image into FAISS — non-blocking
  if (imageUrls.length > 0) {
    visualSearch.indexProduct(product.id, imageUrls[0]).catch(console.error);
  }

  return product;
}

module.exports = { listProducts, getProduct, createProduct };