module.exports = (sequelize, DataTypes) => {
  const DomainSettings = sequelize.define('DomainSettings', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    domain: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    homePageId: {
      type: DataTypes.INTEGER,
    },
  }, {
    freezeTableName: true,
    paranoid: true,
  });

  DomainSettings.associate = function(models) {
    // associations can be defined here
  };

  return DomainSettings;
};
