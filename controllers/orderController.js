const { Order, OrderItem, Cart, CartItem, Product, Payment } = require('../models');

const createOrder = async (req, res, next) => {
  try {
    const { sessionId, paymentMethod, customerEmail, customerPhone, shippingAddress, giftMessage, wrappingStyle } = req.body;

    const cart = await Cart.findOne({
      where: req.user?.id ? { userId: req.user.id } : { sessionId },
      include: [{ model: CartItem, include: [Product] }],
    });
    if (!cart || cart.CartItems.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart is empty' });
    }

    const items = cart.CartItems;
    const subtotal = items.reduce((sum, item) => sum + item.Product.price * item.quantity, 0);
    const shippingFee = 50;
    const total = subtotal + shippingFee;

    const order = await Order.create({
      userId: req.user?.id,
      sessionId,
      customerEmail,
      customerPhone,
      shippingAddress,
      giftMessage,
      wrappingStyle,
      subtotal,
      shippingFee,
      total,
      status: 'pending',
    });

    const orderItems = items.map((item) => ({
      orderId: order.id,
      productId: item.productId,
      productName: item.Product.name,
      price: item.Product.price,
      quantity: item.quantity,
    }));

    await OrderItem.bulkCreate(orderItems);

    const payment = await Payment.create({
      orderId: order.id,
      method: paymentMethod || 'cod',
      status: 'pending',
    });

    await CartItem.destroy({ where: { cartId: cart.id } });

    res.status(201).json({ success: true, order, payment });
  } catch (error) {
    next(error);
  }
};

const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.findAll({
      where: { userId: req.user.id },
      include: [OrderItem, Payment],
      order: [['createdAt', 'DESC']],
    });
    res.json({ success: true, orders });
  } catch (error) {
    next(error);
  }
};

const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findByPk(req.params.id, { include: [OrderItem, Payment] });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    order.status = req.body.status || order.status;
    await order.save();

    res.json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

module.exports = { createOrder, getMyOrders, getOrderById, updateOrderStatus };