const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('ratings_app', 'root', 'root', {
  host: 'localhost',
  dialect: 'mysql'
});

module.exports = sequelize;