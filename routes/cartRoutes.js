const express = require('express');
const router = express.Router();

const {
  getCart,
  addItem,
  updateItem,
  removeItem,
  clearCart
} = require('../controllers/cartController');

const { protect } = require('../middlewares/authMiddleware');

router.get('/', protect, getCart);
router.post('/items', protect, addItem);
router.put('/items/:id', protect, updateItem);
router.delete('/items/:id', protect, removeItem);
router.delete('/clear', protect, clearCart);

module.exports = router;