const { Sequelize } = require('sequelize');

const sequelize = require('../utils/database');

const Message = sequelize.define('message', {
  id: {
    type: Sequelize.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  sender: {
    type: Sequelize.STRING,
    allowNull: false
  },
  receiver: {
    type: Sequelize.STRING,
    allowNull: false
  },
  message: {
    type: Sequelize.STRING,
    allowNull: false
  },
  sender_time: {
    type: Sequelize.STRING
  },
  receiver_time: {
    type: Sequelize.STRING
  }
});

module.exports = Message;