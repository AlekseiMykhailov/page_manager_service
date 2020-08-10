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
          domain, slug, title, description
        } = ctx.params;
        const webPage = {
          domain, slug, title, description
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
      params: {
        slug: 'string',
        title: 'string',
        description: 'string',
      },
      handler(ctx) {
        const { slug, title, description } = ctx.params;

        return this.settings.model.update({ title, description }, {
          where: { slug }
        })
          .then(() => ({ ok: true }))
          .catch((error) => {
            this.logger.error('ERROR: ', error);
            return { ok: false, error };
          });
      },
    },

    deleteWebPage: {
      params: {
        slug: 'string',
      },
      handler(ctx) {
        const { slug } = ctx.params;

        return this.broker.call('publish.isPublished', { slug })
          .then((res) => {
            if (res.ok) {
              return { ok: false, error: 'Published Page could not be deleted' };
            }

            return this.settings.model.destroy({ where: { slug } })
              .then(() => ({ ok: true }))
              .catch((error) => {
                this.logger.error('ERROR: ', error);
                return { ok: false, error };
              });
          });
      },
    },

    getWebPageBySlug: {
      params: {
        slug: 'string',
      },
      handler(ctx) {
        const { slug } = ctx.params;

        return this.settings.model.findOne({ where: { slug } })
          .then(({ dataValues }) => {
            const {
              id, domain, title, description
            } = dataValues;
            return {
              id, domain, slug, title, description
            };
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
              domain, slug, title, description
            } = dataValues;
            return {
              id, domain, slug, title, description
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
            id, domain, slug, title
          }) => ({
            id, domain, slug, title
          }))))
          .then((pages) => ({ ok: true, pages }))
          .catch((error) => ({ ok: false, error }));
      },
    },
  },
};
