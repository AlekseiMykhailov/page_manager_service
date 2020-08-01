const Sequelize = require('sequelize');

const config = require('../config/config.js');
const PublishedPage = require('./publishedPage');

const db = {};
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config,
);

db.PublishedPage = PublishedPage(sequelize, Sequelize);

module.exports = db;
