const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const SECRET = 'your_jwt_secret'; // move to .env in real app

// POST /signup
router.post('/signup', async (req, res) => {
    const { email, password } = req.body;
    try {
      const exists = await User.findOne({ email });
      if (exists) return res.status(400).json({ message: 'User already exists' });
  
      const hash = await bcrypt.hash(password, 10);
      const user = await User.create({ email, password: hash });
  
      const token = jwt.sign({ id: user._id }, SECRET, { expiresIn: '1d' });
      return res.json({ token });
    } catch (err) {
      console.error('Signup error:', err.message);  // 👈 Add this line
      res.status(500).json({ message: 'Signup failed', error: err.message });
    }
  });
  

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, SECRET, { expiresIn: '1d' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
