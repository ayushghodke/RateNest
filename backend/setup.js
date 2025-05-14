const mysql = require('mysql2/promise');
const sequelize = require('./config/database');
require('./models/index');

async function setup() {
  try {
    // Create database if it doesn't exist
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'root',
    });

    await connection.query('CREATE DATABASE IF NOT EXISTS ratings_app');
    await connection.end();
    
    console.log('Database created or already exists.');

    // Sync models
    await sequelize.sync({ alter: true });
    console.log('Models synchronized with database.');

    // Create a default admin user
    const User = require('./models/User');
    const bcrypt = require('bcryptjs');
    
    const adminExists = await User.findOne({ where: { email: 'admin@example.com' } });
    if (!adminExists) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);
      
      await User.create({
        name: 'Admin User',
        email: 'admin@example.com',
        password: hashedPassword,
        address: 'Admin Address',
        role: 'admin'
      });
      console.log('Default admin user created.');
    }

    console.log('Setup completed successfully.');
  } catch (error) {
    console.error('Setup failed:', error);
  } finally {
    process.exit();
  }
}

setup(); 