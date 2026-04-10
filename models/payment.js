const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Payment = sequelize.define(
  'Payment',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    method: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('pending', 'success', 'failed'),
      allowNull: false,
      defaultValue: 'pending',
    },
    transactionId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: 'payments',
    timestamps: true,
  }
);

module.exports = Payment;