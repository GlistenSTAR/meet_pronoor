const { Sequelize } = require('sequelize');

const sequelize = require('../utils/database');

const Friend = sequelize.define('friend', {
  id: {
    type: Sequelize.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  user: {
    type: Sequelize.STRING,
    allowNull: false
  },
  friend: {
    type: Sequelize.STRING,
    allowNull: false
  },
  friend_avatar: {
    type: Sequelize.STRING,
    allowNull: false
  },
  last_time: {
    type: Sequelize.DATE,
    allowNull: false
  }
});

module.exports = Friend;