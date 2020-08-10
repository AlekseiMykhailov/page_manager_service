const Sequelize = require('sequelize');

const config = require('../config/config.json');

const WebPage = require('./WebPage');
const DomainSettings = require('./DomainSettings');
const Row = require('./Row');
const Field = require('./Field');
const PublishedPage = require('./PublishedPage');

const db = {};

const devConfig = config.development;
const sequelize = new Sequelize(
  devConfig.database,
  devConfig.username,
  devConfig.password,
  devConfig,
);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.WebPage = WebPage(sequelize, Sequelize);

db.Row = Row(sequelize, Sequelize);
db.Row.belongsTo(db.WebPage, { foreignKey: 'webPageId' });
db.WebPage.hasMany(db.Row, { foreignKey: 'webPageId' });

db.Field = Field(sequelize, Sequelize);
db.Field.belongsTo(db.Row, { foreignKey: 'rowId' });
db.Row.hasMany(db.Field, { foreignKey: 'rowId' });

db.PublishedPage = PublishedPage(sequelize, Sequelize);
db.PublishedPage.belongsTo(db.WebPage, { foreignKey: 'webPageId' });
db.WebPage.hasMany(db.PublishedPage, { foreignKey: 'webPageId' });

db.DomainSettings = DomainSettings(sequelize, Sequelize);
db.DomainSettings.belongsTo(db.WebPage, { foreignKey: 'homePageId' });
db.WebPage.hasMany(db.DomainSettings, { foreignKey: 'homePageId' });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;
