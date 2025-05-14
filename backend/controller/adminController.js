const  Rating = require('../models/Rating');
const  User = require('../models/User');
const  Store = require('../models/Store');


exports.createUser = async (req, res) => {
  try {
    const { name, email, address, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, address, password: hashedPassword, role });
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
// controllers/adminController.js

exports.dashboard = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    const users = await User.count();
    const stores = await Store.count();
    const ratings = await Rating.count();

    res.json({ totalUsers: users, totalStores: stores, totalRatings: ratings });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.listUsers = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    const users = await User.findAll({
      attributes: ['id', 'name', 'email', 'address', 'role']
    });

    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.listStores = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    const stores = await Store.findAll({
      include: [
        {
          model: Rating,
          attributes: []
        }
      ],
      attributes: [
        'id',
        'name',
        'email',
        'address',
        [sequelize.fn('AVG', sequelize.col('Ratings.value')), 'averageRating']
      ],
      group: ['Store.id']
    });

    res.json(stores);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
