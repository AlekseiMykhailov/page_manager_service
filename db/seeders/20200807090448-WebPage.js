module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('WebPage', [
      {
        domain: 'localhost:3011',
        slug: 'learn-manual-qa-2020',
        title: 'Software Quality Assurance Course',
        description: 'An intensive practical course to prepare you for a successful QA career in just 4 weeks',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        domain: 'localhost:3011',
        slug: 'learn-devops-2020',
        title: 'Learn DevOps Course',
        description: 'An intensive practical course to prepare you for a successful DevOps career in just 12 weeks.',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('WebPage', null, {});
  }
};
