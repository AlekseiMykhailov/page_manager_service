module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Redirect', [
      {
        domainId: 1,
        webPageId: 1,
        slug: 'test',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Redirect', null, {});
  }
};
