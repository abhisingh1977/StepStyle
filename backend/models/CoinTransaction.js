const mongoose = require('mongoose');

const coinTransactionSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['earned', 'redeemed', 'bonus'], required: true },
    amount: { type: Number, required: true },
    description: { type: String, required: true },
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
    balanceAfter: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model('CoinTransaction', coinTransactionSchema);
