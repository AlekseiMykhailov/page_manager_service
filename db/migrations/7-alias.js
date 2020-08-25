module.exports = {
  up: (queryInterface, DataTypes) => queryInterface.createTable('Alias', {
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
  }).then(() => queryInterface.addIndex(
    'Alias',
    ['domainAlias'],
    {
      unique: true,
    },
  )),
  down: (queryInterface, DataTypes) => queryInterface.dropTable('Alias')
};
