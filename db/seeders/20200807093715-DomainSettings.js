module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('DomainSettings', [
      {
        domain: 'jobeasy.loc',
        name: 'JobEasy',
        homePageId: 1,
        robotsTxt: 'User-agent: *\nAllow: /\n\nSitemap: http://jobeasy.loc/sitemap.xml',
        favicon: 'https://uploads-ssl.webflow.com/5c8ff8ef21fa8e172cd8a465/5c90cf9da5701d781c9e9dc3_sign.png',
        webclip: 'https://uploads-ssl.webflow.com/5c8ff8ef21fa8e172cd8a465/5c90cf9da5701d781c9e9dc3_sign.png',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        domain: 'careerist.loc',
        name: 'Careerist',
        homePageId: 3,
        robotsTxt: `User-agent: *
Allow: /

Sitemap: http://careerist.loc/sitemap.xml`,
        favicon: 'https://uploads-ssl.webflow.com/5c8ff8ef21fa8e172cd8a465/5c90cf9da5701d781c9e9dc3_sign.png',
        webclip: 'https://uploads-ssl.webflow.com/5c8ff8ef21fa8e172cd8a465/5c90cf9da5701d781c9e9dc3_sign.png',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('DomainSettings', null, {});
  }
};
