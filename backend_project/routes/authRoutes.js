const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { User, Group } = require('../project_module/model');
const authMiddleware = require('../middleware/auth');
require('dotenv').config();

// ✅ POST /login ➜ Authenticate user and return token + role
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (user.status === 'suspended') {
    return res.status(403).json({ message: 'Your account has been suspended by admin.' });
  }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      role: user.role,
      user,
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// ✅ POST /users/register ➜ Create new user
router.post('/users/register', async (req, res) => {
  try {
    const { name, email, password, role, contact } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const user = new User({
      name,
      email,
      password,
      contact,
      role: role || 'user',
    });

    await user.save();

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      role: user.role,
      user,
    });
  } catch (err) {
    console.error('Registration Error:', err);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// ✅ GET /user/profile ➜ Get user profile info + groups + messages
router.get('/user/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });

    const groups = await Group.find({ members: user._id });
    const messages = [];

    for (const group of groups) {
      const userMessages = group.messages
        .filter((msg) => msg.user.toString() === user._id.toString())
        .map((msg) => ({
          ...msg._doc,
          groupTitle: group.title,
        }));
      messages.push(...userMessages);
    }

    res.status(200).json({ user, groups, messages });
  } catch (err) {
    console.error('Profile fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch profile' });
    console.log("🟡 Current User ID from token:", req.user);

  }
});

// ✅ PUT /user/update-info ➜ Update name/email
router.put('/user/update-info', authMiddleware, async (req, res) => {
  try {
    const { name, email } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, email },
      { new: true }
    ).select('-password');

    if (!user) return res.status(404).json({ error: 'User not found' });

    res.status(200).json({ message: 'User info updated', user });
  } catch (err) {
    console.error('User info update error:', err);
    res.status(500).json({ error: 'Failed to update user info' });
  }
});

// ✅ PUT /user/profile-pic ➜ Update profile picture (Base64)
router.put('/user/profile-pic', authMiddleware, async (req, res) => {
  try {
    const { image } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.profilePic = image;
    await user.save();

    res.status(200).json({ message: 'Profile picture updated successfully' });
  } catch (err) {
    console.error('Profile picture update error:', err);
    res.status(500).json({ error: 'Failed to update profile picture' });
  }
});

module.exports = router;
