module.exports = (sequelize, DataTypes) => {
  const WebPage = sequelize.define('WebPage', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    domainId: {
      type: DataTypes.INTEGER,
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
    indexes: [
      {
        unique: true,
        fields: ['domain', 'slug'],
      }
    ]
  });

  WebPage.associate = function (models) {
    // associations can be defined here
  };

  return WebPage;
};
