const express = require('express');
const router = express.Router();

const { createCustomGift, getCustomGift } = require('../controllers/customGiftController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/', protect, createCustomGift);
router.get('/:id', protect, getCustomGift);

module.exports = router;