module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('DomainSettings', [{
      domain: 'localhost:3011',
      homePageId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    }], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('DomainSettings', null, {});
  }
};
