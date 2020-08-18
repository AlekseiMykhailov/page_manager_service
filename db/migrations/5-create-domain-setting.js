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
        unique: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      homePageId: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'webpage',
          },
          key: 'id',
        },
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
