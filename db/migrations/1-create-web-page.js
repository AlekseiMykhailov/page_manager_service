module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('WebPage', {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    domainId: {
      type: Sequelize.INTEGER,
      allowNull: false,
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
  }).then(() => queryInterface.addIndex(
    'WebPage',
    ['domain', 'slug'],
    {
      unique: true,
    },
  )),

  down: (queryInterface, Sequelize) => queryInterface.dropTable('WebPage')
};
