const { Op } = require('sequelize');
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
        const webPage = { ...ctx.params };

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
          id,
          slug,
          title,
          description,
          disableIndexing,
          ogDefault,
          ogTitle,
          ogDescription,
          ogImage,
        } = ctx.params;

        return this.settings.model.update({
          slug,
          title,
          description,
          disableIndexing,
          ogDefault,
          ogTitle,
          ogDescription,
          ogImage,
        }, {
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

    getWebPageBySlug: {
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
          .then(({ dataValues }) => {
            const {
              id,
              domainId,
              title,
              description,
              ogDefault,
              ogTitle,
              ogDescription,
              ogImage,
              disableIndexing,
              updatedAt,
            } = dataValues;
            return {
              id,
              domainId,
              domain,
              slug,
              title,
              description,
              ogDefault,
              ogTitle,
              ogDescription,
              ogImage,
              disableIndexing,
              updatedAt,
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
              domain,
              slug,
              domainId,
              title,
              description,
              ogDefault,
              ogTitle,
              ogDescription,
              ogImage,
              disableIndexing,
              updatedAt,
            } = dataValues;
            return {
              id,
              domainId,
              domain,
              slug,
              title,
              description,
              ogDefault,
              ogTitle,
              ogDescription,
              ogImage,
              disableIndexing,
              updatedAt,
            };
          })
          .then((data) => ({ ok: true, data }))
          .catch((error) => ({ ok: false, error }));
      },
    },

    numberWebPagesWithSlug: {
      params: {
        domainId: 'number',
        slug: 'string',
      },
      handler(ctx) {
        const { domainId, slug } = ctx.params;

        return this.settings.model.count({
          where: {
            domainId,
            slug: {
              [Op.endsWith]: slug,
            },
          }
        }, { paranoid: false }) // FIXME: deleted pages not counting
          .catch((error) => {
            this.logger.error('ERROR: ', error);
            return { ok: false, error };
          });
      },
    },

    listWebPages: {
      handler() {
        return this.settings.model.findAll({ raw: true })
          .then((pages) => (pages.map(({
            id, domainId, domain, slug, title, description, disableIndexing, updatedAt
          }) => ({
            id, domainId, domain, slug, title, description, disableIndexing, updatedAt
          }))))
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
