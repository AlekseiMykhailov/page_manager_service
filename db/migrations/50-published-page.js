module.exports = {
  up: (queryInterface, DataTypes) => queryInterface.createTable('PublishedPage', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    webPageId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: {
          tableName: 'webpage',
        },
        key: 'id',
      },
    },
    domainId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    domain: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    html: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    publishedAt: {
      type: DataTypes.DATE,
      allowNull: false,
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
      type: DataTypes.DATE,
      allowNull: true,
    },
  }),
  down: (queryInterface, DataTypes) => queryInterface.dropTable('PublishedPage')
};
