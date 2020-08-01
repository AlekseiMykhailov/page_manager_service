const Sequelize = require('sequelize');

const config = require('../config/config.js');
const WebPage = require('./webPage');

const db = {};
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config,
);

db.WebPage = WebPage(sequelize, Sequelize);

module.exports = db;
