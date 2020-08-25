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
      params: {
        id: 'number',
        homePageId: 'number',
      },
      handler(ctx) {
        const { id, homePageId } = ctx.params;

        return this.settings.model.update({ homePageId }, {
          where: { id },
        })
          .then(() => ({ ok: true }))
          .catch((error) => ({ ok: false, error }));
      }
    },

    getDomainSettingsByDomainId: {
      params: {
        id: 'number',
      },
      handler(ctx) {
        const { id } = ctx.params;

        return this.settings.model.findOne({
          where: { id },
        })
          .then(async (response) => ({
            ok: true,
            domainSettings: response.dataValues,
          }))
          .catch((error) => ({ ok: false, error }));
      },
    },

    getDomainSettingsByDomainName: {
      params: {
        domain: 'string',
      },
      handler(ctx) {
        const { domain } = ctx.params;

        return this.settings.model.findOne({
          where: { domain },
        })
          .then(async (response) => ({
            ok: true,
            domainSettings: response.dataValues,
          }))
          .catch((error) => ({ ok: false, error }));
      },
    },

    getDomainData: {
      params: {
        domainId: 'number',
      },
      handler(ctx) {
        const { domainId } = ctx.params;

        return this.settings.model.findOne({ where: { id: domainId } })
          .then((response) => ({ ok: true, domainData: response.dataValues }))
          .catch((error) => ({ ok: false, error }));
      },
    },

    getDomainDataByDomain: {
      params: {
        domain: 'string',
      },
      handler(ctx) {
        const { domain } = ctx.params;

        return this.settings.model.findOne({ where: { domain } })
          .then((response) => ({ ok: true, domainData: response.dataValues }))
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
