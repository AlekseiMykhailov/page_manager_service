const Sequelize = require('sequelize');

const config = require('../config/config.json');

const WebPage = require('./WebPage');
const DomainSettings = require('./DomainSettings');
const Section = require('./Section');
const Field = require('./Field');
const Instructor = require('./Instructor');
const PublishedPage = require('./PublishedPage');
const Redirect = require('./Redirect');
const Alias = require('./Alias');

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
db.Section = Section(sequelize, Sequelize);
db.Field = Field(sequelize, Sequelize);
db.Instructor = Instructor(sequelize, Sequelize);
db.PublishedPage = PublishedPage(sequelize, Sequelize);
db.DomainSettings = DomainSettings(sequelize, Sequelize);
db.Redirect = Redirect(sequelize, Sequelize);
db.Alias = Alias(sequelize, Sequelize);

db.WebPage.hasMany(db.Section, { foreignKey: 'webPageId' });
db.WebPage.hasMany(db.PublishedPage, { foreignKey: 'webPageId' });
db.WebPage.hasMany(db.DomainSettings, { foreignKey: 'homePageId' });
db.WebPage.hasMany(db.Redirect, { foreignKey: 'webPageId' });

db.Section.belongsTo(db.WebPage, { foreignKey: 'webPageId' });
db.Section.hasMany(db.Field, { foreignKey: 'sectionId' });

db.Field.belongsTo(db.Section, { foreignKey: 'sectionId' });

db.PublishedPage.belongsTo(db.WebPage, { foreignKey: 'webPageId' });

db.DomainSettings.belongsTo(db.WebPage, { foreignKey: 'homePageId' });
db.Alias.hasMany(db.DomainSettings, { foreignKey: 'id' });

db.Redirect.belongsTo(db.WebPage, { foreignKey: 'webPageId' });

db.Alias.belongsTo(db.DomainSettings, { foreignKey: 'domainId' });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;
