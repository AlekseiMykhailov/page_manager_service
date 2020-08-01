module.exports = (sequelize, DataTypes) => {
  const WebPage = sequelize.define('web_page', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    isHomePage: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
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
    paranoid: true,
  });

  return WebPage;
};
