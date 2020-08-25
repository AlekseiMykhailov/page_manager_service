const db = require('../models');
const Rest = require('../mixins/rest');

module.exports = {
  name: 'dbAliases',
  mixins: [Rest],
  settings: {
    model: db.Alias,
  },
  actions: {

    addDomainAlias: {
      params: {
        domainId: 'number',
        domainAlias: 'string',
      },
      handler(ctx) {
        const { domainId, domainAlias } = ctx.params;

        return this.settings.model.create({ domainId, domainAlias })
          .then(() => ({ ok: true }))
          .catch((error) => ({ ok: false, error }));
      },
    },

    deleteDomainAlias: {
      params: {
        id: 'number',
      },
      handler(ctx) {
        const { id } = ctx.params;

        return this.settings.model.destroy({ where: { id } })
          .then(() => ({ ok: true }))
          .catch((error) => ({ ok: false, error }));
      },
    },

    getDomainAliases: {
      params: {
        domainId: 'number',
      },
      handler(ctx) {
        const { domainId } = ctx.params;

        return this.settings.model.findAll({ where: { domainId } })
          .then((response) => ({
            ok: true,
            aliases: response.map(({ dataValues }) => ({ ...dataValues }))
          }));
      },
    },

    getMainDomainId: {
      params: {
        domainAlias: 'string',
      },
      handler(ctx) {
        const { domainAlias } = ctx.params;

        return this.settings.model.findOne({ where: { domainAlias } })
          .then((response) => {
            if (response) {
              return {
                ok: true,
                domainId: response.dataValues.domainId,
              };
            }
          });
      },
    }
  },
};
