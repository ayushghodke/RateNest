const {User} = require('../models/User')
const { Store } = require('../models/Store');
const { Rating } = require('../models/Rating');

exports.login = async (req, res) => {
  // same as user login
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

exports.myRatings = async (req, res) => {
  try {
    const { ownerId } = req.query;
    const store = await Store.findOne({ where: { ownerId } });
    if (!store) return res.status(404).json({ message: 'Store not found' });

    const ratings = await Rating.findAll({ where: { storeId: store.id } });
    const avgRating = ratings.reduce((acc, r) => acc + r.value, 0) / ratings.length;
    res.json({ ratings, avgRating });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// controllers/storeOwnerController.js


exports.createOrUpdateStore = async (req, res) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;

    if (role !== 'store_owner') {
      return res.status(403).json({ message: 'Only store owners can create or update store.' });
    }

    const { name, email, address } = req.body;

    // Validate fields
    if (!name || !email || !address) {
      return res.status(400).json({ message: 'Name, email, and address are required.' });
    }

    // Check if store exists for this user
    const existingStore = await Store.findOne({ where: { userId } });

    if (existingStore) {
      // Update existing store
      await Store.update({ name, email, address }, { where: { userId } });
      return res.json({ message: 'Store updated successfully.' });
    } else {
      // Create new store
      await Store.create({ name, email, address, userId });
      return res.json({ message: 'Store created successfully.' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
