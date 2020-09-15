module.exports = {
  up: (queryInterface, DataTypes) => queryInterface.createTable('Schema', {
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
    },
    json: {
      type: DataTypes.JSON,
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
  }).then(() => queryInterface.addIndex(
    'Schema',
    ['name'],
    {
      unique: true,
    },
  )),
  down: (queryInterface, DataTypes) => queryInterface.dropTable('Schema')
};
