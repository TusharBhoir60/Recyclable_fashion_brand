const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true, lowercase: true, trim: true },
    description: { type: String, default: '' },

    price: { type: Number, required: true, min: 0 }, // paise
    images: [{ type: String }],

    category: { type: String, default: '' },
    artisan_name: { type: String, default: '' },

    is_deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', ProductSchema);