const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Store = require('../models/Store');
const Rating = require('../models/Rating');
const { authenticateToken, isAdmin } = require('../middleware/auth');
const { Sequelize, Op } = require('sequelize');
const bcrypt = require('bcryptjs');

// Middleware to ensure user is an admin
router.use(authenticateToken, isAdmin);

// Get all users with optional filters
router.get('/users', async (req, res) => {
  try {
    const { name, email, address, role } = req.query;
    
    // Build filter conditions
    const whereConditions = {};
    if (name) whereConditions.name = { [Op.like]: `%${name}%` };
    if (email) whereConditions.email = { [Op.like]: `%${email}%` };
    if (address) whereConditions.address = { [Op.like]: `%${address}%` };
    if (role) whereConditions.role = role;
    
    const users = await User.findAll({
      where: whereConditions,
      attributes: { exclude: ['password'] }
    });
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error while fetching users' });
  }
});

// Get user by ID with their stores and ratings if they are a store owner
router.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] }
    });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    let userWithDetails = user.toJSON();
    
    // If user is a store owner, get their stores and average rating
    if (user.role === 'store_owner') {
      const stores = await Store.findAll({
        where: { ownerId: user.id },
        include: [{
          model: Rating,
          attributes: []
        }],
        attributes: {
          include: [
            [Sequelize.fn('AVG', Sequelize.col('Ratings.value')), 'averageRating'],
            [Sequelize.fn('COUNT', Sequelize.col('Ratings.id')), 'totalRatings']
          ]
        },
        group: ['Store.id']
      });
      
      userWithDetails.stores = stores;
    }
    
    res.json(userWithDetails);
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ message: 'Server error while fetching user details' });
  }
});

// Create a new user
router.post('/users', async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;
    
    // Validate input
    if (!name || !email || !password || !address || !role) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      address,
      role
    });
    
    // Return user without password
    const userResponse = newUser.toJSON();
    delete userResponse.password;
    
    res.status(201).json(userResponse);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Server error while creating user' });
  }
});

// Update a user
router.put('/users/:id', async (req, res) => {
  try {
    const { name, email, address, role } = req.body;
    const userId = req.params.id;
    
    // Find user
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Update user
    await user.update({
      name: name || user.name,
      email: email || user.email,
      address: address || user.address,
      role: role || user.role
    });
    
    // Return updated user without password
    const userResponse = user.toJSON();
    delete userResponse.password;
    
    res.json(userResponse);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Server error while updating user' });
  }
});

// Delete a user
router.delete('/users/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Find user
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Delete user
    await user.destroy();
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Server error while deleting user' });
  }
});

// Get all stores with optional filters
router.get('/stores', async (req, res) => {
  try {
    const { name, email, address } = req.query;
    
    // Build filter conditions
    const whereConditions = {};
    if (name) whereConditions.name = { [Op.like]: `%${name}%` };
    if (email) whereConditions.email = { [Op.like]: `%${email}%` };
    if (address) whereConditions.address = { [Op.like]: `%${address}%` };
    
    const stores = await Store.findAll({
      where: whereConditions,
      include: [{
        model: User,
        as: 'owner',
        attributes: ['name', 'email']
      }],
      attributes: {
        include: [
          [Sequelize.fn('AVG', Sequelize.col('Ratings.value')), 'averageRating'],
          [Sequelize.fn('COUNT', Sequelize.col('Ratings.id')), 'totalRatings']
        ]
      },
      include: [{
        model: Rating,
        attributes: []
      }],
      group: ['Store.id']
    });
    
    res.json(stores);
  } catch (error) {
    console.error('Error fetching stores:', error);
    res.status(500).json({ message: 'Server error while fetching stores' });
  }
});

// Get store by ID
router.get('/stores/:id', async (req, res) => {
  try {
    const store = await Store.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'name', 'email']
        },
        {
          model: Rating,
          include: [{
            model: User,
            attributes: ['id', 'name']
          }]
        }
      ]
    });
    
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }
    
    // Calculate average rating
    let totalRating = 0;
    store.Ratings.forEach(rating => {
      totalRating += rating.value;
    });
    const averageRating = store.Ratings.length > 0 ? totalRating / store.Ratings.length : 0;
    
    const storeWithRating = store.toJSON();
    storeWithRating.averageRating = averageRating;
    storeWithRating.totalRatings = store.Ratings.length;
    
    res.json(storeWithRating);
  } catch (error) {
    console.error('Error fetching store details:', error);
    res.status(500).json({ message: 'Server error while fetching store details' });
  }
});

// Create a new store
router.post('/stores', async (req, res) => {
  try {
    const { name, email, address, ownerId } = req.body;
    
    // Validate input
    if (!name || !email || !address || !ownerId) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    // Verify that owner exists and is a store owner
    const owner = await User.findByPk(ownerId);
    if (!owner) {
      return res.status(404).json({ message: 'Owner not found' });
    }
    
    if (owner.role !== 'store_owner') {
      return res.status(400).json({ message: 'User must be a store owner to own a store' });
    }
    
    // Create store
    const newStore = await Store.create({
      name,
      email,
      address,
      ownerId
    });
    
    res.status(201).json(newStore);
  } catch (error) {
    console.error('Error creating store:', error);
    res.status(500).json({ message: 'Server error while creating store' });
  }
});

// Update a store
router.put('/stores/:id', async (req, res) => {
  try {
    const { name, email, address } = req.body;
    const storeId = req.params.id;
    
    // Find store
    const store = await Store.findByPk(storeId);
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }
    
    // Update store
    await store.update({
      name: name || store.name,
      email: email || store.email,
      address: address || store.address
    });
    
    res.json(store);
  } catch (error) {
    console.error('Error updating store:', error);
    res.status(500).json({ message: 'Server error while updating store' });
  }
});

// Delete a store
router.delete('/stores/:id', async (req, res) => {
  try {
    const storeId = req.params.id;
    
    // Find store
    const store = await Store.findByPk(storeId);
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }
    
    // Delete store
    await store.destroy();
    
    res.json({ message: 'Store deleted successfully' });
  } catch (error) {
    console.error('Error deleting store:', error);
    res.status(500).json({ message: 'Server error while deleting store' });
  }
});

// Get admin dashboard stats
router.get('/dashboard', async (req, res) => {
  try {
    // Basic counts - these are less likely to fail
    const userCount = await User.count();
    const storeCount = await Store.count();
    const ratingCount = await Rating.count();
    
    // Initialize with empty defaults in case any query fails
    let usersByRole = [];
    let topStores = [];
    let recentActivity = [];
    
    try {
      usersByRole = await User.findAll({
        attributes: ['role', [Sequelize.fn('COUNT', Sequelize.col('role')), 'count']],
        group: ['role']
      });
    } catch (roleErr) {
      console.error('Error fetching user roles:', roleErr);
      // Continue with empty usersByRole
    }
    
    try {
      // Simplified query for top stores
      topStores = await Store.findAll({
        attributes: ['id', 'name', 'email', 'address'],
        include: [{
          model: Rating,
          attributes: []
        }],
        attributes: {
          include: [
            [Sequelize.fn('AVG', Sequelize.col('Ratings.value')), 'averageRating'],
            [Sequelize.fn('COUNT', Sequelize.col('Ratings.id')), 'ratingCount']
          ]
        },
        group: ['Store.id'],
        limit: 5,
        order: [[Sequelize.literal('averageRating'), 'DESC']]
      });
    } catch (storeErr) {
      console.error('Error fetching top stores:', storeErr);
      // Continue with empty topStores
    }
    
    try {
      // Simplified recent activity query
      recentActivity = await Rating.findAll({
        attributes: ['id', 'value', 'comment', 'createdAt'],
        include: [
          {
            model: User,
            attributes: ['id', 'name']
          },
          {
            model: Store,
            attributes: ['id', 'name']
          }
        ],
        order: [['createdAt', 'DESC']],
        limit: 5
      });
    } catch (activityErr) {
      console.error('Error fetching recent activity:', activityErr);
      // Continue with empty recentActivity
    }
    
    res.json({
      totalUsers: userCount,
      totalStores: storeCount,
      totalRatings: ratingCount,
      usersByRole,
      topStores,
      recentActivity
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Server error while fetching dashboard stats' });
  }
});

module.exports = router;