const jwt = require('jsonwebtoken');
const User = require('../models/user');

const authenticateUser = async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET); 
      console.log(decoded);
      const user = await User.findById(decoded.userId); 
      req.user = user 
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
  };
  
  module.exports = { authenticateUser };