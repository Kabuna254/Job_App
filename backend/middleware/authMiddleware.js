const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to protect routes and optionally restrict by role
const protect = (requiredRole = null) => {
  return async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer')) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await User.findById(decoded.id).select('-passwordHash');

      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }

      // Role check, if required
      if (requiredRole && user.role !== requiredRole) {
        return res.status(403).json({ message: 'Access denied: insufficient permissions' });
      }

      req.user = user;
      next();

    } catch (err) {
      res.status(401).json({ message: 'Invalid or expired token' });
    }
  };
};

module.exports = { protect };
