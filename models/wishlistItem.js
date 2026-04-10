const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const WishlistItem = sequelize.define(
  'WishlistItem',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    wishlistId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: 'wishlist_items',
    timestamps: true,
  }
);

module.exports = WishlistItem;