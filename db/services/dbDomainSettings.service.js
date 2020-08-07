const db = require('../models');
const Rest = require('../mixins/rest');

module.exports = {
  name: 'dbDomainSettings',
  mixins: [Rest],
  settings: {
    model: db.DomainSettings,
  },
  actions: {

    addDomain: {
      params: {
        domain: 'string',
        homePageId: 'number',
      },
      handler(ctx) {
        const { domain, homePageId } = ctx.params;

        return this.settings.model.create({ domain, homePageId });
      },
    },

    setHomePageId: {
      params: {
        domain: 'string',
        homePageId: 'number',
      },
      handler(ctx) {
        const { domain, homePageId } = ctx.params;

        return this.settings.model.update({ homePageId }, {
          where: {
            domain,
          }
        });
      },
    },

    getHomePageId: {
      params: {
        domain: 'string',
      },
      handler(ctx) {
        const { domain } = ctx.params;

        return this.settings.model.findOne({
          where: {
            domain,
          },
        })
          .then((res) => ({ ok: true, webPageId: res.dataValues.homePageId }))
          .catch((err) => ({ ok: false, err }));
      },
    },

    getDomains: {
      handler() {
        return this.settings.model.findAll({ raw: true })
          .then((res) => res.map(({ id, domain }) => ({ id, name: domain })))
          .then((domains) => ({ ok: true, domains }));
      },
    },

    getAllSettings: {
      handler() {
        return this.settings.model.findAll({ raw: true });
      }
    },
  },
};
