module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Field', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      rowId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      label: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      type: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      order: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      value: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    }, {}).then(() => {
      return queryInterface.addIndex(
        'Field',
        ['rowId', 'name'],
        { indicesType: 'UNIQUE' },
      );
    });
  },
  down: (queryInterface, Sequelize) => queryInterface.dropTable('Field')
};
