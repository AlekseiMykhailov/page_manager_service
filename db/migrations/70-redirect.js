module.exports = {
  up: (queryInterface, DataTypes) => queryInterface.createTable('Redirect', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    domainId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: {
          tableName: 'domainsettings',
        },
        key: 'id',
      },
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
    slug: {
      type: DataTypes.STRING,
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
  }).then(() => queryInterface.addIndex(
    'Redirect',
    ['domainId', 'slug'],
    {
      unique: true,
    },
  )),
  down: (queryInterface, DataTypes) => queryInterface.dropTable('Redirect')
};
