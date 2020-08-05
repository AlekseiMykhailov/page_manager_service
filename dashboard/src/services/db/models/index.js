const Sequelize = require('sequelize');

const config = require('../config/config.js');
const WebPage = require('./webPage');
const Setting = require('./settings');
const Row = require('./row');
const Field = require('./field');

const db = {};
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config,
);

db.WebPage = WebPage(sequelize, Sequelize);
db.Setting = Setting(sequelize, Sequelize);
db.Row = Row(sequelize, Sequelize);
db.Field = Field(sequelize, Sequelize);

module.exports = db;
