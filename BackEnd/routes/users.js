const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const authMiddleware = require('../middleware/auth');
const User = require('../models/User');

router.use(authMiddleware);

// GET /users/me
router.get('/me', async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT /users/profile — update profile fields
router.put('/profile', async (req, res) => {
    try {
        const {
            firstName, lastName,
            bio, jobTitle, department,
            phone, location,
            github, linkedin, twitter
        } = req.body;

        const full_name = `${firstName || ''} ${lastName || ''}`.trim();

        const updated = await User.findByIdAndUpdate(
            req.user._id,
            {
                full_name,
                bio:        bio        || '',
                jobTitle:   jobTitle   || '',
                department: department || '',
                phone:      phone      || '',
                location:   location   || '',
                github:     github     || '',
                linkedin:   linkedin   || '',
                twitter:    twitter    || '',
            },
            { new: true }
        ).select('-password');

        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT /users/account — update name, email, password
router.put('/account', async (req, res) => {
    try {
        const { username, email, currentPassword, newPassword } = req.body;

        const user = await User.findById(req.user._id);

        // if changing password, verify current password first
        if (newPassword) {
            if (!currentPassword) {
                return res.status(400).json({ error: 'Current password is required' });
            }

            const match = await user.comparePassword(currentPassword);
            if (!match) {
                return res.status(400).json({ error: 'Current password is incorrect' });
            }

            user.password = newPassword; // pre-save hook will hash it
        }

        if (username) user.full_name = username;
        if (email)    user.email     = email.toLowerCase();

        await user.save();

        const updated = await User.findById(user._id).select('-password');
        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;