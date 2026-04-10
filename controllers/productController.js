const { Op } = require('sequelize');
const { Product, Category } = require('../models');

const getProducts = async (req, res, next) => {
  try {
    const { search, categoryId } = req.query;
    const where = {};

    if (search) {
      where.name = { [Op.iLike]: `%${search}%` };
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    const products = await Product.findAll({ where, include: [{ model: Category }] });
    res.json({ success: true, products });
  } catch (error) {
    next(error);
  }
};

const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id, { include: [{ model: Category }] });
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

const getRelatedProducts = async (req, res, next) => {
  try {
    const current = await Product.findByPk(req.params.id);
    if (!current) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const products = await Product.findAll({
      where: {
        categoryId: current.categoryId,
        id: { [Op.ne]: current.id },
      },
      limit: 8,
      order: [['createdAt', 'DESC']],
    });

    res.json({ success: true, products });
  } catch (error) {
    next(error);
  }
};

const createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    await product.update(req.body);
    res.json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    await product.destroy();
    res.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductById,
  getRelatedProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};