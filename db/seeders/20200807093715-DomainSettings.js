module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('DomainSettings', [
      {
        domain: 'jobeasy.loc',
        name: 'JobEasy',
        homePageId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        domain: 'careerist.loc',
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
