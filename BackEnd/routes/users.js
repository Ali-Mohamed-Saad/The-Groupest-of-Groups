const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');

// GET /users/me (protected route)
router.get('/me', authMiddleware, (req, res) => {
  console.log(`Successfully fetched user profile for ID: ${req.user.id}`);
  res.json(req.user);
});

module.exports = router;
