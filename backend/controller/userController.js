const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const  Rating = require('../models/Rating');
const  User = require('../models/User');
const  Store = require('../models/Store');


exports.signup = async (req, res) => {
  try {
    const { name, email, address, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, address, password: hashedPassword, role: 'user' });
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user.id, role: user.role }, 'secret');
    res.json({ token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// userController.js
exports.updatePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { newPassword } = req.body;

    if (!newPassword) return res.status(400).json({ message: 'New password required' });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.update({ password: hashedPassword }, { where: { id: userId } });

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


exports.listStores = async (req, res) => {
  try {
    const stores = await Store.findAll();
    res.json(stores);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.rateStore = async (req, res) => {
  try {
    const { userId, storeId, value } = req.body;
    const [rating, created] = await Rating.upsert({ userId, storeId, value });
    res.json({ rating });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
