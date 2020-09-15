module.exports = {
  up: (queryInterface, DataTypes) => {
    return queryInterface.createTable('Section', {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      schema: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
          model: {
            tableName: 'schema',
          },
          key: 'name',
        },
      },
      webPageId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: 'webPage',
          },
          key: 'id',
        },
      },
      order: {
        type: DataTypes.INTEGER,
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
    }, {});
  },
  down: (queryInterface, DataTypes) => queryInterface.dropTable('Section')
};
