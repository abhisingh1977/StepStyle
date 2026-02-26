const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 },
    avatar: { type: String, default: '' },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    coins: { type: Number, default: 0 },
    level: { type: Number, default: 1, min: 1, max: 5 },
    totalSteps: { type: Number, default: 0 },
    stepsToday: { type: Number, default: 0 },
    streak: { type: Number, default: 0 },
    badges: [{ type: String }],
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
}, { timestamps: true });

userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.calculateLevel = function () {
    const thresholds = [0, 10000, 50000, 150000, 500000];
    for (let i = thresholds.length - 1; i >= 0; i--) {
        if (this.totalSteps >= thresholds[i]) {
            this.level = i + 1;
            return;
        }
    }
};

module.exports = mongoose.model('User', userSchema);
