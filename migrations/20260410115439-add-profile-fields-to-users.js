'use strict';

/** Migration: Add gender, dob, avatar to users table */

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'gender', {
      type: Sequelize.ENUM('male', 'female', 'other', 'prefer_not'),
      allowNull: true,
      defaultValue: null,
    });

    await queryInterface.addColumn('users', 'dob', {
      type: Sequelize.DATEONLY,
      allowNull: true,
      defaultValue: null,
    });

    await queryInterface.addColumn('users', 'avatar', {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('users', 'gender');
    await queryInterface.removeColumn('users', 'dob');
    await queryInterface.removeColumn('users', 'avatar');
  },
};