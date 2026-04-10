const { Cart, CartItem, Product } = require('../models');

const getOrCreateCart = async (userId, sessionId) => {
  if (userId) {
    return Cart.findOrCreate({ where: { userId } });
  }
  return Cart.findOrCreate({ where: { sessionId } });
};

const getCart = async (req, res, next) => {
  try {
    const cart = await getOrCreateCart(req.user?.id, req.body.sessionId);
    const items = await CartItem.findAll({ where: { cartId: cart.id }, include: [Product] });

    res.json({ success: true, cart, items });
  } catch (error) {
    next(error);
  }
};

const addItem = async (req, res, next) => {
  try {
    const { productId, quantity = 1, sessionId } = req.body;
    const cart = await getOrCreateCart(req.user?.id, sessionId);

    const existing = await CartItem.findOne({ where: { cartId: cart.id, productId } });
    if (existing) {
      existing.quantity += Number(quantity);
      await existing.save();
      return res.json({ success: true, item: existing });
    }

    const item = await CartItem.create({ cartId: cart.id, productId, quantity });
    res.status(201).json({ success: true, item });
  } catch (error) {
    next(error);
  }
};

const updateItem = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    const item = await CartItem.findByPk(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Cart item not found' });

    if (quantity <= 0) {
      await item.destroy();
      return res.json({ success: true, message: 'Item removed' });
    }

    item.quantity = quantity;
    await item.save();
    res.json({ success: true, item });
  } catch (error) {
    next(error);
  }
};

const removeItem = async (req, res, next) => {
  try {
    const item = await CartItem.findByPk(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Cart item not found' });
    await item.destroy();
    res.json({ success: true, message: 'Item removed' });
  } catch (error) {
    next(error);
  }
};

const clearCart = async (req, res, next) => {
  try {
    const cart = await getOrCreateCart(req.user?.id, req.body.sessionId);
    await CartItem.destroy({ where: { cartId: cart.id } });
    res.json({ success: true, message: 'Cart cleared' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getCart, addItem, updateItem, removeItem, clearCart };