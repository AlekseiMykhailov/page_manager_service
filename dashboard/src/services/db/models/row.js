module.exports = (sequelize, DataTypes) => {
  const Row = sequelize.define('row', {
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
    paranoid: true,
  });

  return Row;
};
