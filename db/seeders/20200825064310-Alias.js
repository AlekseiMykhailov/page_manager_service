module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Alias', [
      {
        domainId: 1,
        domainAlias: 'jobeasy-old.loc',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Alias', null, {});
  }
};
