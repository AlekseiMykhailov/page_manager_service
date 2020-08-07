module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Row', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      schemaId: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      webPageId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      order: {
        type: Sequelize.INTEGER,
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
    }, {});
  },
  down: (queryInterface, Sequelize) => queryInterface.dropTable('Row')
};
