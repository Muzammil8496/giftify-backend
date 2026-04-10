const { GiftBundle, GiftBundleItem, Product } = require('../models');

const createCustomGift = async (req, res, next) => {
  try {
    const { name, description, items, price, image } = req.body;

    const bundle = await GiftBundle.create({
      name,
      description,
      price,
      image,
      isCustom: true,
    });

    if (Array.isArray(items) && items.length) {
      const rows = items.map((item) => ({
        giftBundleId: bundle.id,
        productId: item.productId,
        quantity: item.quantity || 1,
      }));
      await GiftBundleItem.bulkCreate(rows);
    }

    res.status(201).json({ success: true, bundle });
  } catch (error) {
    next(error);
  }
};

const getCustomGift = async (req, res, next) => {
  try {
    const bundle = await GiftBundle.findByPk(req.params.id, {
      include: [{ model: GiftBundleItem, include: [{ model: Product }] }],
    });

    if (!bundle) return res.status(404).json({ success: false, message: 'Custom gift not found' });
    res.json({ success: true, bundle });
  } catch (error) {
    next(error);
  }
};

module.exports = { createCustomGift, getCustomGift };