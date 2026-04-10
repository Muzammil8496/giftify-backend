const { Wishlist, WishlistItem, Product } = require('../models');

const getWishlistForUser = async (userId) => {
  let wishlist = await Wishlist.findOne({ where: { userId } });
  if (!wishlist) wishlist = await Wishlist.create({ userId });
  return wishlist;
};

const getWishlist = async (req, res, next) => {
  try {
    const wishlist = await getWishlistForUser(req.user.id);
    const items = await WishlistItem.findAll({
      where: { wishlistId: wishlist.id },
      include: [{ model: Product }],
      order: [['createdAt', 'DESC']],
    });
    res.json({ success: true, wishlist, items });
  } catch (error) {
    next(error);
  }
};

const toggleWishlist = async (req, res, next) => {
  try {
    const { productId } = req.body;
    const wishlist = await getWishlistForUser(req.user.id);
    const existing = await WishlistItem.findOne({ where: { wishlistId: wishlist.id, productId } });

    if (existing) {
      await existing.destroy();
      return res.json({ success: true, inWishlist: false });
    }

    await WishlistItem.create({ wishlistId: wishlist.id, productId });
    res.status(201).json({ success: true, inWishlist: true });
  } catch (error) {
    next(error);
  }
};

const removeWishlistItem = async (req, res, next) => {
  try {
    const item = await WishlistItem.findByPk(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Wishlist item not found' });
    await item.destroy();
    res.json({ success: true, message: 'Wishlist item removed' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getWishlist, toggleWishlist, removeWishlistItem };