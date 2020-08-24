module.exports = (sequelize, DataTypes) => {
  const PublishedPage = sequelize.define('PublishedPage', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    webPageId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: {
          tableName: 'webpage',
        },
        key: 'id',
      },
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
    publishedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    html: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    deletedAt: {
      allowNull: true,
      type: DataTypes.DATE,
    },
  }, {
    freezeTableName: true,
    paranoid: true,
  });

  PublishedPage.associate = function(models) {
    // associations can be defined here
  };

  return PublishedPage;
};
