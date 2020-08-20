module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('DomainSettings', [
      {
        domain: 'localhost:5001',
        name: 'JobEasy',
        homePageId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        domain: 'localhost:5002',
        name: 'Careerist',
        homePageId: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('DomainSettings', null, {});
  }
};
