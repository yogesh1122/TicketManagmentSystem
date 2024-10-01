const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./config/database');
const userRoutes = require('./routes/userRoute');
const agentRoutes = require('./routes/agentRoutes')
const adminRotes = require('./routes/adminRoutes')
const winston = require('winston');
const logger = require('./utils/logger');
const xssClean = require('xss-clean');
const cors = require('cors')
// initialize Express app
const app = express();
// const corsOptions = {
//   origin: 'http://localhost:3000', // Frontend URL
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
// };
// app.use(cors('*'))
app.use(cors({
  origin: 'http://localhost:3000', // Replace with your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
}))
app.use(bodyParser.json());
app.use(xssClean()); //xss-clean [Input Sanitization]
// initialize Logger
// const logger = winston.createLogger({
//   level: 'info',
//   format: winston.format.json(),
//   transports: [
//     new winston.transports.Console(),
//     new winston.transports.File({ filename: 'error.log', level: 'error' }),
//   ],
// });

// use Routes
app.use('/users', userRoutes);
// use agent 
app.use('/agents', agentRoutes);

app.use('/admin',adminRotes)
// Database Connection and Server Start
sequelize.sync()
  .then(() => {
    console.log('Database connected successfully.');
    logger.info('Database connected successfully.');
    app.listen(process.env.SERVER_PORT, () => console.log(`Server running on port ${process.env.SERVER_PORT}`));
  })
  .catch(err => console.error('Unable to connect to the database:', err));
