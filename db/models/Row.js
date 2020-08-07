module.exports = (sequelize, DataTypes) => {
  const Row = sequelize.define('Row', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    schemaId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    webPageId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    freezeTableName: true,
  });

  Row.associate = function(models) {
    // associations can be defined here
  };

  return Row;
};
