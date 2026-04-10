const { body, validationResult, param, query } = require('express-validator');

/**
 * Middleware to check for validation errors
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map(err => ({
        field: err.param,
        message: err.msg
      })),
    });
  }
  next();
};

/**
 * User registration validation
 */
const registerValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('phone').optional().isMobilePhone().withMessage('Valid phone number required'),
  validate,
];

/**
 * User login validation
 */
const loginValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
  validate,
];

/**
 * Product query validation
 */
const productQueryValidation = [
  query('q').optional().isString().withMessage('Query must be a string'),
  query('cat').optional().isInt().withMessage('Category must be an integer'),
  query('filter')
    .optional()
    .isIn(['new', 'bestseller', 'trending'])
    .withMessage('Filter must be new, bestseller, or trending'),
  query('min').optional().isFloat({ min: 0 }).withMessage('Min must be a positive number'),
  query('max').optional().isFloat({ min: 0 }).withMessage('Max must be a positive number'),
  validate,
];

/**
 * Cart item validation
 */
const cartItemValidation = [
  body('productId').isInt().withMessage('Product ID must be an integer'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  validate,
];

/**
 * Wishlist toggle validation
 */
const wishlistToggleValidation = [
  body('productId').isInt().withMessage('Product ID must be an integer'),
  validate,
];

/**
 * Order validation
 */
const orderValidation = [
  body('items').isArray({ min: 1 }).withMessage('Items array is required'),
  body('items.*.productId').isInt().withMessage('Product ID must be integer'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  validate,
];

/**
 * Payment validation
 */
const paymentValidation = [
  body('amount').isFloat({ min: 0.01 }).withMessage('Amount must be greater than 0'),
  body('method').notEmpty().withMessage('Payment method is required'),
  validate,
];

/**
 * Custom gift validation
 */
const customGiftValidation = [
  body('recipientName').notEmpty().withMessage('Recipient name is required'),
  body('message').optional().isString().withMessage('Message must be a string'),
  body('deliveryDate').optional().isISO8601().withMessage('Delivery date must be valid'),
  validate,
];

module.exports = {
  validate,
  registerValidation,
  loginValidation,
  productQueryValidation,
  cartItemValidation,
  wishlistToggleValidation,
  orderValidation,
  paymentValidation,
  customGiftValidation,
};