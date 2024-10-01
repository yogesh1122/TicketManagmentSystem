const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
require('dotenv').config();
const logger = require('../utils/logger');

// rolechange a new user
exports.roleChange = async (req, res) => {
    const { userrole } = req.body;
    console.log('***********req.body',req.body);
    
    const { id } = req.params;
    console.log(req.body);
    
    try {
      const existingUser = await User.findOne({ where: { id } });
      if (!existingUser) {
        logger.info(`User does not exists : ${email}`);
        return res.status(400).json({ message: 'User does not exists' });
      }
      existingUser.role = userrole || existingUser.role;
    //   agent.email = email || agent.email;
      await existingUser.save();

      logger.info(`User has been modified ID: ${existingUser.id}`);
      res.status(201).json({ message: 'User has been modified successfully', userId: existingUser.id });
    } catch (err) {
      logger.error(`Error registering user: ${err.message}`);
      res.status(500).json({ message: 'Internal server error', error: err.message });
    }
  };
  

exports.deleteAgentUser = async (req, res) => {
    const { id } = req.params;
    try {
      const agent = await User.findByPk(id);
      if (!agent || agent.role !== 'agent') {
        return res.status(404).json({ message: 'Agent not found' });
      }
      await agent.destroy();
      res.json({ message: 'Agent deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting agent', error });
    }
  };

exports.getAllUserAgents = async (req, res) => {
    try {
      const agents = await User.findAll({
        where: {
          role: {
            [Op.or]: ['agent', 'user']
          }
        }
      });
      res.json({agents,totalCount : agents.length});
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving agents', error });
    }
  }; 
  
// // login user and issue JWT
// exports.login = async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     const user = await User.findOne({ where: { email } });
//     if (!user) {
//       logger.warn(`Failed login attempt with non-existent email: ${email}`);
//       return res.status(401).json({ message: 'Invalid email or password' });
//     }

//     const isPasswordValid = await bcrypt.compare(password, user.password);
//     if (!isPasswordValid) {
//       logger.warn(`Invalid password attempt for email: ${email}`);
//       return res.status(401).json({ message: 'Invalid email or password' });
//     }

//     const token = jwt.sign({ userId: user.id, role: user.role,username:user.username }, process.env.JWT_SECRET, { expiresIn: '3h' });
//     res.status(200).json({ message: 'User Logged-In successfully', token , userRole: user.role });
//     // res.json({ token });
//   } catch (err) {
//     logger.info(`User logged in with ID: ${user.id}`);
//     res.status(500).json({ message: 'Internal server error', error: err.message });
//   }
// };

// Get user/agent profile
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
