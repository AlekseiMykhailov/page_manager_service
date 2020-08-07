module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('PublishedPage', {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    webPageId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    slug: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    html: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    publishedAt: {
      type: Sequelize.DATE,
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
    deletedAt: {
      type: Sequelize.DATE,
      allowNull: true,
    },
  }),
  down: (queryInterface, Sequelize) => queryInterface.dropTable('PublishedPage')
};
