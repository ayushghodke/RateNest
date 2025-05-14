const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Register a new user
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;
    
    console.log('Registration request received:', { name, email, address, role });
    
    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }
    
    // Basic validation
    if (!name || name.length < 3) {
      return res.status(400).json({ message: 'Name must be at least 3 characters long' });
    }
    
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
    
    if (!password) {
      return res.status(400).json({ message: 'Password is required' });
    }
    
    if (!address) {
      return res.status(400).json({ message: 'Address is required' });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create new user
    try {
      const user = await User.create({
        name,
        email,
        password: hashedPassword,
        address,
        role: role || 'user'
      });
      
      res.status(201).json({ message: 'User registered successfully' });
    } catch (validationError) {
      console.error('Validation error:', validationError);
      if (validationError.name === 'SequelizeValidationError') {
        return res.status(400).json({ 
          message: 'Validation error',
          errors: validationError.errors.map(err => ({
            field: err.path,
            message: err.message
          }))
        });
      }
      throw validationError;
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Create JWT token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      'your_jwt_secret', // In production, use environment variable
      { expiresIn: '1d' }
    );
    
    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

module.exports = router; 