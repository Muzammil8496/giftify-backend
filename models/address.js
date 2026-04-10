const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Address = sequelize.define(
  'Address',
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
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    addressLine1: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    addressLine2: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Pakistan',
    },
    zipCode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: 'addresses',
    timestamps: true,
  }
);

module.exports = Address;