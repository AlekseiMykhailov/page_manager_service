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
    name: {
      type: DataTypes.STRING,
    },
    homePageId: {
      type: DataTypes.INTEGER,
      references: {
        model: {
          tableName: 'webpage',
        },
        key: 'id',
      },
    },
    robotsTxt: {
      type: DataTypes.STRING,
    },
    favicon: {
      type: DataTypes.STRING,
    },
    webclip: {
      type: DataTypes.STRING,
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
        fields: ['domain'],
      }
    ],
  });

  DomainSettings.associate = function(models) {
    // associations can be defined here
  };

  return DomainSettings;
};
