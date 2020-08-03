const db = require('./models');
const Rest = require('./mixins/rest');

module.exports = {
  name: 'dbSettings',
  mixins: [Rest],
  settings: {
    model: db.Settings,
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

    getAllSettings: {
      handler() {
        return this.settings.model.findAll({ raw: true });
      }
    },
  },
};
