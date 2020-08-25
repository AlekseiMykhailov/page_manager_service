module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('WebPage', [
      {
        domainId: 1,
        domain: 'jobeasy.loc',
        slug: 'learn-manual-qa-2020',
        title: 'Software Quality Assurance Course',
        description: 'An intensive practical course to prepare you for a successful QA career in just 4 weeks',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        domainId: 1,
        domain: 'jobeasy.loc',
        slug: 'learn-devops-2020',
        title: 'Learn DevOps Course',
        description: 'An intensive practical course to prepare you for a successful DevOps career in just 12 weeks.',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        domainId: 2,
        domain: 'careerist.loc',
        slug: 'python-intensive',
        title: 'Python intensive course',
        description: 'An immersive practical course to boost your tech career with the most popular programming language right now.',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('WebPage', null, {});
  }
};
