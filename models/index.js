const sequelize = require('../config/db');

const User = require('./user');
const Category = require('./category');
const Product = require('./product');
const Cart = require('./cart');
const CartItem = require('./cartitem');
const Wishlist = require('./wishlist');
const WishlistItem = require('./wishlistitem');
const Order = require('./order');
const OrderItem = require('./orderitem');
const Payment = require('./payment');
const Address = require('./address');
const GiftBundle = require('./giftBundle');
const GiftBundleItem = require('./giftBundleItem');
const Coupon = require('./coupon');

Category.hasMany(Product, { foreignKey: 'categoryId', onDelete: 'CASCADE' });
Product.belongsTo(Category, { foreignKey: 'categoryId' });

User.hasMany(Cart, { foreignKey: 'userId', onDelete: 'SET NULL' });
Cart.belongsTo(User, { foreignKey: 'userId' });

Cart.hasMany(CartItem, { foreignKey: 'cartId', onDelete: 'CASCADE' });
CartItem.belongsTo(Cart, { foreignKey: 'cartId' });

Product.hasMany(CartItem, { foreignKey: 'productId', onDelete: 'CASCADE' });
CartItem.belongsTo(Product, { foreignKey: 'productId' });

User.hasMany(Wishlist, { foreignKey: 'userId', onDelete: 'CASCADE' });
Wishlist.belongsTo(User, { foreignKey: 'userId' });

Wishlist.hasMany(WishlistItem, { foreignKey: 'wishlistId', onDelete: 'CASCADE' });
WishlistItem.belongsTo(Wishlist, { foreignKey: 'wishlistId' });

Product.hasMany(WishlistItem, { foreignKey: 'productId', onDelete: 'CASCADE' });
WishlistItem.belongsTo(Product, { foreignKey: 'productId' });

User.hasMany(Order, { foreignKey: 'userId', onDelete: 'SET NULL' });
Order.belongsTo(User, { foreignKey: 'userId' });

Order.hasMany(OrderItem, { foreignKey: 'orderId', onDelete: 'CASCADE' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId' });

Product.hasMany(OrderItem, { foreignKey: 'productId', onDelete: 'SET NULL' });
OrderItem.belongsTo(Product, { foreignKey: 'productId' });

Order.hasMany(Payment, { foreignKey: 'orderId', onDelete: 'CASCADE' });
Payment.belongsTo(Order, { foreignKey: 'orderId' });

User.hasMany(Address, { foreignKey: 'userId', onDelete: 'SET NULL' });
Address.belongsTo(User, { foreignKey: 'userId' });

GiftBundle.hasMany(GiftBundleItem, { foreignKey: 'giftBundleId', onDelete: 'CASCADE' });
GiftBundleItem.belongsTo(GiftBundle, { foreignKey: 'giftBundleId' });

Product.hasMany(GiftBundleItem, { foreignKey: 'productId', onDelete: 'CASCADE' });
GiftBundleItem.belongsTo(Product, { foreignKey: 'productId' });

module.exports = {
  sequelize,
  User,
  Category,
  Product,
  Cart,
  CartItem,
  Wishlist,
  WishlistItem,
  Order,
  OrderItem,
  Payment,
  Address,
  GiftBundle,
  GiftBundleItem,
  Coupon,
};