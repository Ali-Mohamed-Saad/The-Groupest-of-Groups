const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.error('Authentication failed: Authorization header missing or invalid format');
      return res.status(401).json({ error: 'Authorization header missing or invalid' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_super_secret_key_here');

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      console.error(`Authentication failed: User with ID ${decoded.id} not found in database`);
      return res.status(401).json({ error: 'User not found or invalid token' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error details:', error.message);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

module.exports = authMiddleware;