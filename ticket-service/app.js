const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./config/database');
const ticketRoutes = require('./routes/ticketRoutes');
const errorHandler = require('./middlewares/errorHandler');
const logger = require('./utils/logger');
const cors = require('cors')
const app = express();
// app.use(bodyParser.json());
app.use(cors({
  origin: 'http://localhost:3000', // Replace with your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
}))
app.use(express.json());
app.use(express.urlencoded({extended:true}))

// Use Routes
app.use('/', ticketRoutes);

// Global error handler
app.use(errorHandler);

// Database Connection and Server Start
sequelize.sync()
  .then(() => {
    logger.info('Database connected successfully.');
    app.listen(process.env.SERVER_PORT, () => logger.info(`Server running on port ${process.env.SERVER_PORT}`));
  })
  .catch(err => logger.error('Unable to connect to the database:', err));
