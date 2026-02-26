const Product = require('../models/Product');

exports.getProducts = async (req, res) => {
    try {
        const { category, minPrice, maxPrice, sort, search, trending, newArrival, deal, limit, page } = req.query;
        const query = {};

        if (category) query.category = category;
        if (trending === 'true') query.isTrending = true;
        if (newArrival === 'true') query.isNewArrival = true;
        if (deal === 'true') query.isDeal = true;
        if (search) query.name = { $regex: search, $options: 'i' };
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        let sortOption = { createdAt: -1 };
        if (sort === 'price_asc') sortOption = { price: 1 };
        if (sort === 'price_desc') sortOption = { price: -1 };
        if (sort === 'rating') sortOption = { rating: -1 };
        if (sort === 'discount') sortOption = { discountPercent: -1 };

        const pageNum = parseInt(page) || 1;
        const limitNum = parseInt(limit) || 20;
        const skip = (pageNum - 1) * limitNum;

        const [products, total] = await Promise.all([
            Product.find(query).sort(sortOption).skip(skip).limit(limitNum),
            Product.countDocuments(query)
        ]);

        res.json({ products, total, page: pageNum, pages: Math.ceil(total / limitNum) });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
