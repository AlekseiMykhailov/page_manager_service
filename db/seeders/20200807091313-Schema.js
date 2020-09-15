const header = require('./schemas/header.json');
const benefits = require('./schemas/benefits.json');
const reviews = require('./schemas/reviews.json');
const instructors = require('./schemas/instructors.json');
const applyForm = require('./schemas/applyForm.json');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Schema', [
      {
        name: 'header',
        type: 'section',
        json: JSON.stringify(header),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'benefits',
        type: 'section',
        json: JSON.stringify(benefits),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'reviews',
        type: 'section',
        json: JSON.stringify(reviews),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'instructors',
        type: 'section',
        json: JSON.stringify(instructors),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'applyForm',
        type: 'section',
        json: JSON.stringify(applyForm),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Schema', null, {});
  }
};
