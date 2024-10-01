const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// Verify if the user is authenticated and has an admin role
exports.verifyAdmin = async (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);

    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden: Admin access required' });
    }

    req.user = user; // Set user info to request object
    next();
  } catch (error) {
    res.status(403).json({ message: 'Forbidden: Invalid token' });
  }
};

exports.isAgentOrAdmin = async (req, res, next) => {
  try {
    console.log('getall agents');
    
    const user = await User.findByPk(req.user.userId);
    console.log(`auth logs admin middle ${user.role}`);
    if (user && (user.role === 'agent' || user.role === 'admin')) {
      req.user = user;
      next();
    } else {
      return res.status(403).json({ message: 'Permission denied. Must be an agent or admin.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
};