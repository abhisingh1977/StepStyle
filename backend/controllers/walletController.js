const User = require('../models/User');
const CoinTransaction = require('../models/CoinTransaction');

exports.getWallet = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('coins level totalSteps stepsToday streak badges');
        const transactions = await CoinTransaction.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(20);

        const levelThresholds = [0, 10000, 50000, 150000, 500000];
        const nextLevelSteps = user.level < 5 ? levelThresholds[user.level] : levelThresholds[4];
        const prevLevelSteps = levelThresholds[user.level - 1];
        const progress = user.level < 5 ? Math.min(100, Math.round(((user.totalSteps - prevLevelSteps) / (nextLevelSteps - prevLevelSteps)) * 100)) : 100;

        res.json({
            coins: user.coins,
            level: user.level,
            totalSteps: user.totalSteps,
            stepsToday: user.stepsToday,
            streak: user.streak,
            badges: user.badges,
            nextLevelSteps,
            progress,
            transactions,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.addCoins = async (req, res) => {
    try {
        const { amount, description } = req.body;
        if (!amount || amount <= 0) return res.status(400).json({ message: 'Invalid amount' });

        const user = await User.findById(req.user._id);
        user.coins += amount;
        user.totalSteps += amount * 10;
        user.stepsToday += amount * 10;
        user.calculateLevel();
        await user.save();

        await CoinTransaction.create({
            user: user._id, type: 'earned', amount, description: description || 'Steps reward', balanceAfter: user.coins,
        });

        res.json({ coins: user.coins, level: user.level, totalSteps: user.totalSteps });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
