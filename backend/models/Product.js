const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    discountPercent: { type: Number, default: 0 },
    maxCoinsUsable: { type: Number, default: 0 },
    category: { type: String, required: true, enum: ['men', 'women', 'electronics', 'beauty', 'shoes'] },
    images: [{ type: String }],
    brand: { type: String, default: '' },
    rating: { type: Number, default: 4.0 },
    reviewCount: { type: Number, default: 0 },
    stock: { type: Number, default: 100 },
    tags: [{ type: String }],
    isNewArrival: { type: Boolean, default: false },
    isTrending: { type: Boolean, default: false },
    isDeal: { type: Boolean, default: false },
}, { timestamps: true });

productSchema.virtual('discountedPrice').get(function () {
    return Math.round(this.price * (1 - this.discountPercent / 100));
});

productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Product', productSchema);
