module.exports = (sequelize, DataTypes) => {
  const Schema = sequelize.define('Schema', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    json: {
      type: DataTypes.JSON,
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
    indexes: [
      {
        unique: true,
        fields: ['name'],
      }
    ],
  });

  Schema.associate = function(models) {
    // associations can be defined here
  };

  return Schema;
};
