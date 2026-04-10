const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Coupon = sequelize.define(
  'Coupon',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    type: {
      type: DataTypes.ENUM('percentage', 'fixed'),
      allowNull: false,
      defaultValue: 'percentage',
    },
    value: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    minOrderAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    tableName: 'coupons',
    timestamps: true,
  }
);

module.exports = Coupon;