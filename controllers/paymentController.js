const { Payment, Order } = require('../models');

const createPayment = async (req, res, next) => {
  try {
    const { orderId, method } = req.body;
    const payment = await Payment.create({ orderId, method, status: 'pending' });
    res.status(201).json({ success: true, payment });
  } catch (error) {
    next(error);
  }
};

const confirmPayment = async (req, res, next) => {
  try {
    const { paymentId, transactionId } = req.body;
    const payment = await Payment.findByPk(paymentId);
    if (!payment) return res.status(404).json({ success: false, message: 'Payment not found' });

    payment.status = 'success';
    payment.transactionId = transactionId || payment.transactionId;
    await payment.save();

    const order = await Order.findByPk(payment.orderId);
    if (order) {
      order.status = 'paid';
      await order.save();
    }

    res.json({ success: true, payment });
  } catch (error) {
    next(error);
  }
};

const paymentWebhook = async (req, res, next) => {
  try {
    const { orderId, status, transactionId } = req.body;
    const payment = await Payment.findOne({ where: { orderId } });
    if (!payment) return res.status(404).json({ success: false, message: 'Payment not found' });

    payment.status = status;
    payment.transactionId = transactionId || payment.transactionId;
    await payment.save();

    const order = await Order.findByPk(orderId);
    if (order && status === 'success') {
      order.status = 'paid';
      await order.save();
    }

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};

module.exports = { createPayment, confirmPayment, paymentWebhook };