const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// POST /auth/register
router.post('/register', async (req, res) => {
  try {
    const { full_name, email, password } = req.body;

    console.log(`Registration attempt for email: ${email}`);

    if (!full_name || !full_name.trim() || !email || !email.trim() || !password || !password.trim()) {
      console.warn('Registration validation failed: Missing required fields');
      return res.status(400).json({ error: 'All fields (full_name, email, password) are required' });
    }

    const existingUser = await User.findOne({ email: email.trim().toLowerCase() });
    if (existingUser) {
      console.warn(`Registration failed: Email ${email} is already taken`);
      return res.status(400).json({ error: 'Email is already taken' });
    }

    const user = await new User({
      full_name: full_name.trim(),
      email: email.trim().toLowerCase(),
      password: password.trim()
    }).save();

    console.log(`User created successfully with ID: ${user._id}`);

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET || 'your_super_secret_key_here',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        full_name: user.full_name,
        email: user.email,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Registration server error:', error);
    res.status(500).json({ error: 'Internal server error during registration' });
  }
});

// POST /auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log(`Login attempt for email: ${email}`);

    if (!email || !email.trim() || !password || !password.trim()) {
      console.warn('Login validation failed: Email or password missing');
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user) {
      console.warn(`Login failed: No user found with email ${email}`);
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password.trim());
    if (!isMatch) {
      console.warn(`Login failed: Incorrect password for email ${email}`);
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    console.log(`User logged in successfully: ID ${user._id}`);

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET || 'your_super_secret_key_here',
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        full_name: user.full_name,
        email: user.email,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Login server error:', error);
    res.status(500).json({ error: 'Internal server error during login' });
  }
});

// POST /auth/logout
router.post('/logout', (req, res) => {
  console.log('User logout endpoint reached.');
  res.json({ success: true });
});

module.exports = router;