module.exports = (sequelize, DataTypes) => {
  const Redirect = sequelize.define('Redirect', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    domainId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: {
          tableName: 'domainsettings',
        },
        key: 'id',
      },
    },
    webPageId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: {
          tableName: 'webpage',
        },
        key: 'id',
      },
    },
    slug: {
      type: DataTypes.STRING,
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
  }, {
    freezeTableName: true,
    indexes: [
      {
        unique: true,
        fields: ['domainId', 'slug'],
      }
    ]
  });

  Redirect.associate = function(models) {
    // associations can be defined here
  };

  return Redirect;
};
