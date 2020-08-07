module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('DomainSettings', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      domain: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      homePageId: {
        type: Sequelize.INTEGER,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      deletedAt: {
        type: Sequelize.DATE,
      },
    }, {});
  },
  down: (queryInterface, Sequelize) => queryInterface.dropTable('DomainSettings')
};
