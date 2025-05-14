const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Store = require('../models/Store');
const Rating = require('../models/Rating');
const { authenticateToken } = require('../middleware/auth');

// Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Server error while fetching profile' });
  }
});

// Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { name, email, address } = req.body;
    const user = await User.findByPk(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Update user
    await user.update({
      name: name || user.name,
      email: email || user.email,
      address: address || user.address
    });
    
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      address: user.address,
      role: user.role
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Server error while updating profile' });
  }
});

// Get user's stores (for store owners)
router.get('/stores', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'store_owner') {
      return res.status(403).json({ message: 'Access denied. Store owner role required.' });
    }
    
    const stores = await Store.findAll({
      where: { ownerId: req.user.id }
    });
    
    // Calculate average rating for each store
    const storesWithRatings = await Promise.all(stores.map(async (store) => {
      const ratings = await Rating.findAll({ where: { storeId: store.id } });
      const averageRating = ratings.length > 0 
        ? ratings.reduce((sum, rating) => sum + rating.value, 0) / ratings.length 
        : 0;
      
      return {
        ...store.toJSON(),
        averageRating,
        totalRatings: ratings.length
      };
    }));
    
    res.json(storesWithRatings);
  } catch (error) {
    console.error('Error fetching user stores:', error);
    res.status(500).json({ message: 'Server error while fetching stores' });
  }
});

// Get user's ratings
router.get('/ratings', authenticateToken, async (req, res) => {
  try {
    console.log('Fetching ratings for user:', req.user.id);
    const ratings = await Rating.findAll({
      where: { userId: req.user.id },
      include: [{
        model: Store,
        as: 'Store', // Explicitly naming the association 
        attributes: ['id', 'name', 'address', 'email']
      }],
      order: [['createdAt', 'DESC']]
    });
    
    // Map to ensure store data is always accessible
    const cleanRatings = ratings.map(rating => {
      const ratingData = rating.toJSON();
      // Ensure 'store' is available for backward compatibility
      if (ratingData.Store && !ratingData.store) {
        ratingData.store = ratingData.Store;
      }
      return ratingData;
    });
    
    res.json(cleanRatings);
  } catch (error) {
    console.error('Error fetching user ratings:', error);
    res.status(500).json({ message: 'Server error while fetching ratings' });
  }
});

module.exports = router;