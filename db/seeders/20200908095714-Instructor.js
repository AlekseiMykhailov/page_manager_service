module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Instructor', [
      {
        name: 'Max Glubochansky',
        photo: 'https://uploads-ssl.webflow.com/5c8ff8ef21fa8e172cd8a465/5eb23c2c42d8e150dd57af22_teacher_max_glub.png',
        about: 'QA engineer of 6 years at Apple, Intel and other Silicon Valley companies',
        linkedIn: 'https://www.linkedin.com/in/maxqa/',
        facebook: '',
        email: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Lana Levinsohn',
        photo: 'https://uploads-ssl.webflow.com/5c8ff8ef21fa8e172cd8a465/5eb23c2cf2d2bf77aceaef07_teacher_lana.png',
        about: '8 years of experience in all kinds of manual and automated testing',
        linkedIn: 'https://www.linkedin.com/in/svetlanalevinsohn/',
        facebook: '',
        email: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Natalia Atif',
        photo: 'https://uploads-ssl.webflow.com/5c8ff8ef21fa8e172cd8a465/5eb23c2d1d060679e9b378a2_teacher_natalia.png',
        about: 'QA lead of 10 years at Intel, Apple and other Silicon Valley companies',
        linkedIn: 'https://www.linkedin.com/in/nataliia-atif/',
        facebook: '',
        email: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Yuriy Sokolov',
        photo: 'https://uploads-ssl.webflow.com/5c8ff8ef21fa8e172cd8a465/5eb23c2c61d24f22b92f5666_teacher_yuri.png',
        about: 'QA Team Lead at Google, with 7+ years of experience in IT',
        linkedIn: 'https://www.linkedin.com/in/iurii-sokolov-1027b66b/',
        facebook: '',
        email: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Patrick Siebenthal',
        photo: 'https://uploads-ssl.webflow.com/5c8ff8ef21fa8e172cd8a465/5effd3a7549ac20b55ef74a7_teacher_patrick.png',
        about: 'QA Engineer at Facebook and Intel with 6+ years in VR and Mobile testing',
        linkedIn: 'https://www.linkedin.com/in/patricksiebenthal/',
        facebook: '',
        email: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Alex Khvastovich',
        photo: 'https://uploads-ssl.webflow.com/5c8ff8ef21fa8e172cd8a465/5eb23c2d0d5bdf10d6925f08_teacher_ahvastovich.png',
        about: 'QA Manager at United Power, 7+ years in Multiplatform/Web Software QA',
        linkedIn: 'https://www.linkedin.com/in/alexkhvastovich/',
        facebook: '',
        email: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Instructor', null, {});
  }
};
