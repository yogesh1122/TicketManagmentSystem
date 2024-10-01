const { DataTypes } = require('sequelize');
const { v4: uuidv4 } = require('uuid')
const sequelize = require('../config/database');
const Ticket = sequelize.define('Ticket', {
  id: {
    type: DataTypes.UUID,
    defaultValue: uuidv4, // Automatically generate UUIDs
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('open', 'in-progress', 'closed'),
    defaultValue: 'open',
  },
  userId: {
    type: DataTypes.UUID,
    references: {
      model: 'Users', // Name of the table in the database
      key: 'id'
    },
    allowNull: false
  },
  agentId: {
    type: DataTypes.UUID,
    references: {
      model: 'Users', // Name of the table in the database
      key: 'id',
    },
    allowNull: true, // Can be null if no agent is assigned
  },
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high'),
    defaultValue: 'medium',
  },
}, {
  timestamps: true,
});

module.exports = {Ticket};
