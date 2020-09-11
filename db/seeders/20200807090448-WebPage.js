module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('WebPage', [
      {
        domainId: 1,
        domain: 'jobeasy.loc',
        slug: 'learn-manual-qa-2020',
        title: 'Software Quality Assurance Course',
        description: 'An intensive practical course to prepare you for a successful QA career in just 4 weeks',
        disableIndexing: false,
        ogTitle: 'Software Quality Assurance Course',
        ogDescription: 'An intensive practical course to prepare you for a successful QA career in just 4 weeks',
        ogDefault: true,
        ogImage: 'https://uploads-ssl.webflow.com/5c8ff8ef21fa8e172cd8a465/5eae6aec00e6c65d4bed5c79_EN_OG%20MULTI.jpg',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        domainId: 1,
        domain: 'jobeasy.loc',
        slug: 'learn-devops-2020',
        title: 'Learn DevOps Course',
        description: 'An intensive practical course to prepare you for a successful DevOps career in just 12 weeks.',
        disableIndexing: false,
        ogTitle: 'Custom Title',
        ogDescription: 'Custom Description',
        ogDefault: false,
        ogImage: 'https://uploads-ssl.webflow.com/5c8ff8ef21fa8e172cd8a465/5eae6aec00e6c65d4bed5c79_EN_OG%20MULTI.jpg',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        domainId: 2,
        domain: 'careerist.loc',
        slug: 'python-intensive',
        title: 'Python intensive course',
        description: 'An immersive practical course to boost your tech career with the most popular programming language right now.',
        ogTitle: 'Python intensive course',
        ogDescription: 'An immersive practical course to boost your tech career with the most popular programming language right now.',
        ogDefault: true,
        ogImage: 'https://uploads-ssl.webflow.com/5c8ff8ef21fa8e172cd8a465/5eae6aec00e6c65d4bed5c79_EN_OG%20MULTI.jpg',
        disableIndexing: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('WebPage', null, {});
  }
};
