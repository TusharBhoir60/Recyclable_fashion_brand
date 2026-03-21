// controllers/product.controller.js  (add to createProduct)
exports.createProduct = async (req, res, next) => {
  try {
    const product = await productService.createProduct(req.body);

    // Index the product's first image in the visual search index
    if (req.body.images?.length > 0) {
      const firstImageUrl = req.body.images[0];
      // Download image buffer from Cloudinary URL
      const imageRes = await fetch(firstImageUrl);
      const buffer   = Buffer.from(await imageRes.arrayBuffer());

      // Non-blocking — don't fail the product creation if ML service is down
      visualSearchService.indexNewProduct(product, buffer, `${product.id}.jpg`)
        .catch(err => console.error('Visual index update failed:', err));
    }

    res.status(201).json(product);
  } catch (err) { next(err); }
};