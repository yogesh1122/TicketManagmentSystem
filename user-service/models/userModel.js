const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const { v4: uuidv4 } = require('uuid');
const { Ticket } = require('../../ticket-service/models/ticket');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: uuidv4, // Automatically generate UUIDs
    primaryKey: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('user', 'admin', 'agent'),
    defaultValue: 'user',
  },
}, {
  timestamps: true,
});

// Define relationships
// User.hasMany(Ticket, { foreignKey: 'userId', as: 'CreatedTickets' }); // One user can create many tickets
// User.hasMany(Ticket, { foreignKey: 'agentId', as: 'AssignedTickets' }); // One user (as an agent) can be assigned to many tickets
// Ticket.belongsTo(User, { foreignKey: 'userId', as: 'Creator' }); // Each ticket belongs to the user who created it
// Ticket.belongsTo(User, { foreignKey: 'agentId', as: 'AssignedAgent' }); // Each ticket can have one assigned agent

module.exports = User;
