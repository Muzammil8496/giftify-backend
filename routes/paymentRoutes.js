const express = require('express');
const router = express.Router();

const { createPayment, paymentWebhook } = require('../controllers/paymentController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/create', protect, createPayment);
router.post('/webhook', paymentWebhook);

module.exports = router;