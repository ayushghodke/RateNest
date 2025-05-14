const express = require('express');
const router = express.Router();
const Store = require('../models/Store');
const { authenticateToken, isStoreOwner } = require('../middleware/auth');

// Middleware to ensure user is a store owner
router.use(authenticateToken, isStoreOwner);

// Create a new store
router.post('/stores', async (req, res) => {
  try {
    const { name, email, address } = req.body;
    
    const store = await Store.create({
      name,
      email,
      address,
      ownerId: req.user.id
    });
    
    res.status(201).json(store);
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
    
    // Check if store belongs to the user
    const store = await Store.findOne({
      where: { id: storeId, ownerId: req.user.id }
    });
    
    if (!store) {
      return res.status(404).json({ message: 'Store not found or not authorized' });
    }
    
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
    
    // Check if store belongs to the user
    const store = await Store.findOne({
      where: { id: storeId, ownerId: req.user.id }
    });
    
    if (!store) {
      return res.status(404).json({ message: 'Store not found or not authorized' });
    }
    
    await store.destroy();
    
    res.json({ message: 'Store deleted successfully' });
  } catch (error) {
    console.error('Error deleting store:', error);
    res.status(500).json({ message: 'Server error while deleting store' });
  }
});

module.exports = router;