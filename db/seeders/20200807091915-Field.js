module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Field', [
      {
        sectionId: 1,
        order: 10,
        name: 'title',
        value: 'Python intensive course',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        sectionId: 1,
        order: 20,
        name: 'description',
        value: 'An immersive practical course to boost your tech career with the most popular programming language right now.',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        sectionId: 1,
        order: 30,
        name: 'backgroundImage',
        value: 'https://uploads-ssl.webflow.com/5c8ff8ef21fa8e172cd8a465/5e628ca748ce2f379610c987_12312312312.jpg',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        sectionId: 1,
        order: 10,
        name: 'qtaButton[1].text',
        value: 'Apply Now',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        sectionId: 1,
        order: 10,
        name: 'qtaButton[1].url',
        value: '#form',
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      {
        sectionId: 2,
        order: 10,
        name: 'title',
        value: 'Why learn Python now?',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        sectionId: 2,
        order: 10,
        name: 'benefitItem[1].title',
        value: 'Really easy and fast to learn',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        sectionId: 2,
        order: 20,
        name: 'benefitItem[1].description',
        value: 'Python is really easy to understand language with friendly syntaxis',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        sectionId: 2,
        order: 10,
        name: 'benefitItem[2].title',
        value: 'The most popular language',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        sectionId: 2,
        order: 20,
        name: 'benefitItem[2].description',
        value: 'A lot of employers need Python developers on their projects',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        sectionId: 2,
        order: 10,
        name: 'benefitItem[3].title',
        value: 'Large community',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        sectionId: 2,
        order: 20,
        name: 'benefitItem[3].description',
        value: 'There is a large online community of Python users and experts',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        sectionId: 2,
        order: 10,
        name: 'benefitItem[4].title',
        value: 'Higher Salary',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        sectionId: 2,
        order: 20,
        name: 'benefitItem[4].description',
        value: 'Python developers earn $116,028 per year on average in the US',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Field', null, {});
  }
};
