module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Section', [
      {
        schemaId: '1',
        webPageId: 1,
        order: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        schemaId: '2',
        webPageId: 1,
        order: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        schemaId: '1',
        webPageId: 2,
        order: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        schemaId: '2',
        webPageId: 2,
        order: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        schemaId: '1',
        webPageId: 3,
        order: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        schemaId: '2',
        webPageId: 3,
        order: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Section', null, {});
  }
};
