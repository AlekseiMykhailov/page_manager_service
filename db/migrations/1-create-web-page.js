module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('WebPage', {
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
      slug: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.STRING,
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
        allowNull: true,
        type: Sequelize.DATE,
      },
    }, { }).then(() => {
      return queryInterface.addIndex(
        'WebPage',
        ['domain', 'slug'],
        { indicesType: 'UNIQUE' },
      );
    });
  },
  down: (queryInterface, Sequelize) => queryInterface.dropTable('WebPage')
};
