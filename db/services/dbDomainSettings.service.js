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

    setDomainSettings: {
      params: {},
      handler(ctx) {
        const { id, homePageId } = ctx.params;

        return this.settings.model.update({ homePageId }, {
          where: { id },
        })
          .then(() => ({ ok: true }))
          .catch((error) => ({ ok: false, error }));
      }
    },

    getDomainSettings: {
      params: {
        domain: 'string',
      },
      handler(ctx) {
        const { domain } = ctx.params;

        return this.settings.model.findOne({
          where: { domain },
        })
          .then((res) => ({ ok: true, webPageId: res.dataValues.homePageId }))
          .catch((error) => ({ ok: false, error }));
      },
    },

    getDomains: {
      handler() {
        return this.settings.model.findAll({ raw: true })
          .then((res) => res.map(({
            id, domain, name, homePageId
          }) => ({
            id, domain, name, homePageId
          })))
          .then((domains) => ({ ok: true, domains }))
          .catch((error) => ({ ok: false, error }));
      },
    },
  },
};
