module.exports = {
  up: (queryInterface, DataTypes) => {
    return queryInterface.createTable('DomainSettings', {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      domain: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      homePageId: {
        type: DataTypes.INTEGER,
        references: {
          model: {
            tableName: 'webpage',
          },
          key: 'id',
        },
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
      },
    }, {});
  },
  down: (queryInterface, DataTypes) => queryInterface.dropTable('DomainSettings')
};
