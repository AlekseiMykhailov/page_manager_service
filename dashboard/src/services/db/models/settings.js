module.exports = (sequelize, DataTypes) => {
  const Settings = sequelize.define('setting', {
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
      allowNull: false,
    },
  }, {
    paranoid: true,
  });

  return Settings;
};
