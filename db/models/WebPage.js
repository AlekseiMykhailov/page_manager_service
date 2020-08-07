module.exports = (sequelize, DataTypes) => {
  const WebPage = sequelize.define('WebPage', {
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
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {
    freezeTableName: true,
    paranoid: true,
  });

  WebPage.associate = function(models) {
    // associations can be defined here
  };

  return WebPage;
};
