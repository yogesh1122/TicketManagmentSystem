const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(401).json({ message: 'Access Denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
    
    req.user = decoded;  
    console.log(`decodede data of auth`,req.user);
    next();
  } catch (err) {
    res.status(400).json({ message: 'Invalid token' });
  }
};
