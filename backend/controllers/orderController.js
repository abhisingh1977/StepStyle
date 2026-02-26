const Order = require('../models/Order');
const User = require('../models/User');
const CoinTransaction = require('../models/CoinTransaction');

exports.createOrder = async (req, res) => {
    try {
        const { items, subtotal, coinsUsed, shippingAddress } = req.body;
        const user = await User.findById(req.user._id);

        if (coinsUsed > user.coins) return res.status(400).json({ message: 'Insufficient coins' });

        const coinDiscount = coinsUsed;
        const totalAmount = Math.max(0, subtotal - coinDiscount);

        const order = await Order.create({
            user: user._id, items, subtotal, coinsUsed, coinDiscount, totalAmount,
            shippingAddress, paymentStatus: 'completed', razorpayOrderId: `demo_${Date.now()}`,
        });

        // Deduct coins
        if (coinsUsed > 0) {
            user.coins -= coinsUsed;
            await user.save();
            await CoinTransaction.create({
                user: user._id, type: 'redeemed', amount: coinsUsed,
                description: `Used for order #${order._id.toString().slice(-6)}`,
                orderId: order._id, balanceAfter: user.coins,
            });
        }

        res.status(201).json(order);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('user', 'name email');
        if (!order) return res.status(404).json({ message: 'Order not found' });
        res.json(order);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
