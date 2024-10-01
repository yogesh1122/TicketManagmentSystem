const { Sequelize } = require('sequelize');
require('dotenv').config();

// const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
//   host: process.env.DB_HOST,
//   dialect: 'postgres',
//   // port: process.env.PORT,
//   logging: false, 
// });

const sequelize = new Sequelize('ticketmanagmentsystem', 'postgres', 'root', {
    host: '127.0.0.1',
    dialect: 'postgres',
    port: 5432
  });

module.exports = sequelize;
