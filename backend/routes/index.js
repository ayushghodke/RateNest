const express = require('express');
const router = express.Router();
const userRoutes = require('./user');
const adminRoutes = require('./admin');
const storeOwnerRoutes = require('./storeOwner');
const authRoutes = require('./auth');
const storeRoutes = require('./store');

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/admin', adminRoutes);
router.use('/store-owner', storeOwnerRoutes);
router.use('/stores', storeRoutes);

module.exports = router;