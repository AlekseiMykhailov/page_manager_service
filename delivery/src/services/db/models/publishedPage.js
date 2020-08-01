module.exports = (sequelize, DataTypes) => {
  const PublishedPage = sequelize.define('published_page', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    webPageId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    publishedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    html: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    isHomePage: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
  }, {
    paranoid: true,
  });

  return PublishedPage;
};
