module.exports = (sequelize, DataTypes) => {
  const Alias = sequelize.define('Alias', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    domainAlias: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    domainId: {
      type: DataTypes.INTEGER,
      references: {
        model: {
          tableName: 'domainSettings',
        },
        key: 'id',
      },
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
        fields: ['aliasDomain'],
      }
    ],
  });

  Alias.associate = function(models) {
    // associations can be defined here
  };

  return Alias;
};
