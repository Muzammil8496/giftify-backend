const calculateOrderTotals = (items) => {
  const subtotal = items.reduce((sum, item) => {
    const price = Number(item.price || item.Product?.price || 0);
    const qty = Number(item.quantity || 0);
    return sum + price * qty;
  }, 0);

  const shippingFee = subtotal >= 50 ? 0 : 9.99;
  const total = subtotal + shippingFee;

  return {
    subtotal: Number(subtotal.toFixed(2)),
    shippingFee: Number(shippingFee.toFixed(2)),
    total: Number(total.toFixed(2)),
  };
};

module.exports = { calculateOrderTotals };