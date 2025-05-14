const express = require('express');
const router = express.Router();
const Store = require('../models/Store');
const Rating = require('../models/Rating');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');

// Get all stores
router.get('/', async (req, res) => {
  try {
    const stores = await Store.findAll();
    
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
    console.error('Error fetching stores:', error);
    res.status(500).json({ message: 'Server error while fetching stores' });
  }
});

// Get top rated stores
router.get('/top', async (req, res) => {
  try {
    const stores = await Store.findAll();
    
    // Calculate average rating for each store
    let storesWithRatings = await Promise.all(stores.map(async (store) => {
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
    
    // Sort by average rating and limit to top 6
    storesWithRatings = storesWithRatings
      .sort((a, b) => b.averageRating - a.averageRating)
      .slice(0, 6);
    
    res.json(storesWithRatings);
  } catch (error) {
    console.error('Error fetching top stores:', error);
    res.status(500).json({ message: 'Server error while fetching top stores' });
  }
});

// Get single store
router.get('/:id', async (req, res) => {
  try {
    const store = await Store.findByPk(req.params.id);
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }
    
    // Get ratings
    const ratings = await Rating.findAll({ where: { storeId: store.id } });
    const averageRating = ratings.length > 0 
      ? ratings.reduce((sum, rating) => sum + rating.value, 0) / ratings.length 
      : 0;
    
    res.json({
      ...store.toJSON(),
      averageRating,
      totalRatings: ratings.length
    });
  } catch (error) {
    console.error('Error fetching store:', error);
    res.status(500).json({ message: 'Server error while fetching store' });
  }
});

// Get store ratings
router.get('/:id/ratings', async (req, res) => {
  try {
    const storeId = req.params.id;
    
    // Check if store exists
    const store = await Store.findByPk(storeId);
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }
    
    const ratings = await Rating.findAll({ 
      where: { storeId },
      include: [
        {
          model: User,
          attributes: ['id', 'name']
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    
    res.json(ratings);
  } catch (error) {
    console.error('Error fetching ratings:', error);
    res.status(500).json({ message: 'Server error while fetching ratings' });
  }
});

// Add rating to store
router.post('/:id/ratings', authenticateToken, async (req, res) => {
  try {
    const { value, comment } = req.body;
    const storeId = req.params.id;
    const userId = req.user.id;
    
    console.log('Received rating request:', { storeId, userId, value, comment });
    
    // Validate rating value
    if (!value || value < 1 || value > 5) {
      return res.status(400).json({ message: 'Rating value must be between 1 and 5' });
    }
    
    // Check if store exists
    const store = await Store.findByPk(storeId);
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }
    
    // Check if user already rated this store
    const existingRating = await Rating.findOne({ where: { userId, storeId } });
    if (existingRating) {
      // Update existing rating
      await existingRating.update({ 
        value, 
        comment: comment !== undefined ? comment : existingRating.comment 
      });
      
      console.log('Updated existing rating:', existingRating.id);
      res.json(existingRating);
    } else {
      // Create new rating
      const rating = await Rating.create({
        value,
        comment,
        userId,
        storeId
      });
      
      console.log('Created new rating:', rating.id);
      res.status(201).json(rating);
    }
  } catch (error) {
    console.error('Error adding rating:', error);
    res.status(500).json({ message: 'Server error while adding rating' });
  }
});

module.exports = router; 