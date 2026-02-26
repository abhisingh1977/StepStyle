const express = require('express');
const router = express.Router();
const { getWallet, addCoins } = require('../controllers/walletController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getWallet);
router.post('/add', protect, addCoins);

module.exports = router;
