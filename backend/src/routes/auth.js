// routes/auth.js — Register & Login
const express = require('express');
const bcrypt = require('bcryptjs');
const { createUser, findUserByEmail } = require('../store');
const { signToken } = require('../auth');

const router = express.Router();

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (findUserByEmail(email)) {
    return res.status(400).json({ error: 'Email already in use' });
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = createUser({ name, email, password: hashed, role });

  const token = signToken({ id: user.id, role: user.role });
  res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = findUserByEmail(email);
  if (!user) return res.status(400).json({ error: 'Invalid credentials' });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ error: 'Invalid credentials' });

  const token = signToken({ id: user.id, role: user.role });
  res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
});

module.exports = router;
