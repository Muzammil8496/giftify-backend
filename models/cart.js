const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Cart = sequelize.define(
  'Cart',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    sessionId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: 'carts',
    timestamps: true,
  }
);

module.exports = Cart;