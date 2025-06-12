require('dotenv').config();
const router = require('express').Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET;

router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ username, email, password: hashed });
  res.json(user);
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ msg: 'Invalid credentials' });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ msg: 'Invalid credentials' });

  const token = jwt.sign({ id: user._id, username: user.username }, SECRET);

  res
    .cookie('token', token, {
      path: '/',
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: false,
      sameSite: 'Lax',
      secure: false,
    })
    .json({ token });
});

module.exports = router;
