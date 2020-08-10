const db = require('../models');
const Rest = require('../mixins/rest');

const PUBLISHED_SERVER = 'http://localhost:3011';

module.exports = {
  name: 'dbPublishedPage',
  mixins: [Rest],
  settings: {
    model: db.PublishedPage,
  },
  actions: {

    createPublishedPage: {
      params: {
        id: 'number',
        slug: 'string',
        html: 'string',
      },
      handler(ctx) {
        const { id, slug, html } = ctx.params;
        const publishedAt = Date.now();
        const publishingPage = {
          webPageId: id,
          slug,
          publishedAt,
          html,
        };

        return this.settings.model.create(publishingPage)
          .then(() => ({ ok: true, data: { url: `${PUBLISHED_SERVER}/${slug}`, publishedAt } }))
          .catch((err) => {
            this.logger.error('ERROR CREATE PUBLISH PAGE: ', err);

            return { ok: false, error: err };
          });
      },
    },

    updatePublishedPage: {
      params: {
        slug: 'string',
        html: 'string',
      },
      handler(ctx) {
        const { slug, html } = ctx.params;
        const publishedAt = Date.now();

        return this.settings.model.update({ publishedAt, html }, {
          where: {
            slug,
          }
        })
          .then(() => ({ ok: true, data: { url: `${PUBLISHED_SERVER}/${slug}`, publishedAt } }))
          .catch((err) => {
            this.logger.error('ERROR UPDATE PUBLISH PAGE: ', err);

            return { ok: false, error: err };
          });
      },
    },

    destroyPublishedPage: {
      params: {
        slug: 'string',
      },
      handler(ctx) {
        const { slug } = ctx.params;

        return this.settings.model.destroy({
          where: {
            slug,
          }
        })
          .then(() => ({ ok: true }))
          .catch((err) => {
            this.logger.error('ERROR DESTROY PUBLISH PAGE: ', err);

            return { ok: false, error: err };
          });
      },
    },

    getPublishedPageBySlug: {
      params: {
        slug: 'string',
      },
      handler(ctx) {
        const { slug } = ctx.params;

        return this.settings.model.findOne({ where: { slug } })
          .then((res) => {
            if (!res) {
              throw new Error(`Page with slug "${slug}" not published.`);
            }

            return res;
          })
          .then((res) => ({ ok: true, data: { ...res.dataValues, url: `${PUBLISHED_SERVER}/${slug}` } }))
          .catch((err) => {
            this.logger.error('ERROR: ', err);

            return { ok: false, error: err };
          });
      },
    },

    getPublishedPageByWebPageId: {
      params: {
        webPageId: 'number',
      },
      handler(ctx) {
        const { webPageId } = ctx.params;

        return this.settings.model.findOne({
          where: {
            webPageId,
          },
        })
          .then((res) => ({
            ok: true,
            data: {
              ...res.dataValues,
              url: `${PUBLISHED_SERVER}/${res.dataValues.slug}`,
            }
          }))
          .catch((err) => {
            this.logger.error('ERROR: ', err);
            return { ok: false, error: err };
          });
      },
    },

    getAllPublishedPages: {
      handler() {
        return this.settings.model.findAll({ raw: true })
          .then(
            (pages) => (pages.map(({
              id, webPageId, slug, publishedAt
            }) => ({
              id,
              webPageId,
              slug,
              url: `${PUBLISHED_SERVER}/${slug}`,
              publishedAt,
            })))
          )
          .then((pages) => ({ ok: true, pages }))
          .catch((err) => {
            this.logger.error('ERROR: ', err);
            return { ok: false, error: err };
          });
      },
    },
  },
};
