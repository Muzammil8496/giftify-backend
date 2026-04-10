const express = require('express');
const router = express.Router();

const {
  getWishlist,
  toggleWishlist,
  removeWishlistItem
} = require('../controllers/wishlistController');

const { protect } = require('../middlewares/authMiddleware');

router.get('/', protect, getWishlist);
router.post('/toggle', protect, toggleWishlist);
router.delete('/items/:id', protect, removeWishlistItem);

module.exports = router;