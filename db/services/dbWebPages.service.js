const db = require('../models');
const Rest = require('../mixins/rest');

module.exports = {
  name: 'dbWebPages',
  mixins: [Rest],
  settings: {
    model: db.WebPage,
  },
  actions: {

    createWebPage: {
      params: {
        domain: 'string',
        slug: 'string',
        title: 'string',
        description: 'string',
      },
      handler(ctx) {
        const {
          domainId, domain, slug, title, description
        } = ctx.params;
        const webPage = {
          domainId, domain, slug, title, description
        };

        return this.settings.model.create(webPage)
          .then((res) => ({ ok: true, id: res.dataValues.id }))
          .catch((error) => {
            this.logger.error('ERROR CREATE PAGE: ', error);
            return { ok: false, error };
          });
      },
    },

    updateWebPage: {
      handler(ctx) {
        const {
          id, slug, title, description
        } = ctx.params;

        return this.settings.model.update({ slug, title, description }, {
          where: { id }
        })
          .then(() => ({ ok: true }))
          .catch((error) => {
            this.logger.error('ERROR UPDATE PAGE: ', error);
            return { ok: false, error };
          });
      },
    },

    deleteWebPage: {
      params: {
        id: 'number',
      },
      handler(ctx) {
        const { id } = ctx.params;

        return this.settings.model.destroy({ where: { id: +id } })
          .then(() => ({ ok: true }))
          .catch((error) => {
            this.logger.error('ERROR DELETE PAGE: ', error);
            return { ok: false, error };
          });
      },
    },

    checkWebPageBySlug: {
      params: {
        domain: 'string',
        slug: 'string',
      },
      handler(ctx) {
        const { domain, slug } = ctx.params;

        return this.settings.model.findOne({
          where: {
            domain,
            slug,
          }
        })
          .then((response) => {
            if (response) {
              return { ok: true };
            }

            return { ok: false };
          })
          .then((data) => ({ ok: true, data }))
          .catch((error) => ({ ok: false, error }));
      },
    },

    getWebPageById: {
      params: {
        id: 'number',
      },
      handler(ctx) {
        const { id } = ctx.params;

        return this.settings.model.findOne({ where: { id } })
          .then(({ dataValues }) => {
            const {
              domainId, domain, slug, title, description, updatedAt
            } = dataValues;
            return {
              id, domainId, domain, slug, title, description, updatedAt
            };
          })
          .then((data) => ({ ok: true, data }))
          .catch((error) => ({ ok: false, error }));
      },
    },

    getAllWebPages: {
      handler() {
        return this.settings.model.findAll({ raw: true })
          .then((pages) => (pages.map(({
            id, domainId, domain, slug, title, description, updatedAt
          }) => ({
            id, domainId, domain, slug, title, description, updatedAt
          }))))
          .then((pages) => ({ ok: true, pages }))
          .catch((error) => ({ ok: false, error }));
      },
    },

    checkSlug: {
      params: {
        domainId: 'number',
        slug: 'string',
      },
      handler(ctx) {
        const { domainId, slug } = ctx.params;

        return this.settings.model.findOne({ where: { domainId, slug, } })
          .then((response) => {
            if (response) {
              return { ok: true };
            }

            return { ok: false };
          })
          .catch((error) => ({ ok: false, error }));
      },
    },
  },
};
