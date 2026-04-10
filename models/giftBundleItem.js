const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const GiftBundleItem = sequelize.define(
  'GiftBundleItem',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    giftBundleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
  },
  {
    tableName: 'gift_bundle_items',
    timestamps: true,
  }
);

module.exports = GiftBundleItem;