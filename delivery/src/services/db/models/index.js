const Sequelize = require('sequelize');

const config = require('../config/config.js');
const Page = require('./page');

const db = {};
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config,
);

db.Page = Page(sequelize, Sequelize);

module.exports = db;
