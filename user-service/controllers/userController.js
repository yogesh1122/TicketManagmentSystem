const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const logger = require('../utils/logger');

// register a new user
exports.signup = async (req, res) => {
  const { username, email, password } = req.body;
  console.log(req.body);
  
  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      logger.info(`User already exists with email: ${email}`);
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("data",{ username, email, password: hashedPassword });
        
    const newUser = await User.create({ username, email, password: hashedPassword });
    console.log('im in');
    
    logger.info(`New user registered with ID: ${newUser.id}`);
    res.status(201).json({ message: 'User registered successfully', userId: newUser.id });
  } catch (err) {
    logger.error(`Error registering user: ${err.message}`);
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
};

// login user and issue JWT
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      logger.warn(`Failed login attempt with non-existent email: ${email}`);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      logger.warn(`Invalid password attempt for email: ${email}`);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: user.id, role: user.role,username:user.username }, process.env.JWT_SECRET, { expiresIn: '3h' });
    res.status(200).json({ message: 'User Logged-In successfully', token , userRole: user.role });
    // res.json({ token });
  } catch (err) {
    logger.info(`User logged in with ID: ${user.id}`);
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
};

// Get user profile
exports.getProfile = async (req, res) => {
  const { userId } = req.user;
  try {
    console.log('--',req.user.username)
    const user = await User.findByPk(userId, { attributes: ['id', 'username', 'email', 'role'] });
    if (!user) {
      logger.warn(`Profile not found for user ID: ${userId}`);
      return res.status(404).json({ message: 'User not found' });
    }
    logger.info(`Profile retrieved for user ID: ${userId}`);
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
};
