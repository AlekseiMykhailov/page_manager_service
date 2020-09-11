const db = require('../models');
const Rest = require('../mixins/rest');

module.exports = {
  name: 'dbDomainSettings',
  mixins: [Rest],
  settings: {
    model: db.DomainSettings,
  },
  actions: {
    createDomain: {
      params: {
        domain: 'string',
        homePageId: 'number',
      },
      handler(ctx) {
        return this.settings.model.create({ ...ctx.params });
      },
    },

    setDomainSettings: {
      params: {
        id: 'number',
      },
      handler(ctx) {
        const { id, ...rest } = ctx.params;

        return this.settings.model.update({ ...rest }, { where: { id } })
          .then(() => ({ ok: true }))
          .catch((err) => {
            this.logger.error('ERROR SET DOMAIN SETTINGS DB: ', err);
            return { ok: false, error: err };
          });
      }
    },

    getDomainSettingsByDomainId: {
      params: {
        domainId: 'number',
      },
      handler(ctx) {
        const { domainId } = ctx.params;

        return this.settings.model.findOne({
          where: { id: domainId },
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

    listDomains: {
      handler() {
        return this.settings.model.findAll({ raw: true })
          .then((res) => res.map(({
            id, domain, name, homePageId
          }) => ({
            id, domain, name, homePageId
          })))
          .catch((error) => ({ ok: false, error }));
      },
    },
  },
};
