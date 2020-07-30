module.exports = (sequelize, DataTypes) => {
  const Page = sequelize.define('page', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    uuid: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    publishedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    html: {
      type: DataTypes.TEXT,
      allowNull: false,
    }
  }, {});

  return Page;
};
