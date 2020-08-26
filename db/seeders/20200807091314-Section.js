module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Section', [
      {
        schema: 'header',
        webPageId: 1,
        order: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        schema: 'benefits',
        webPageId: 1,
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
