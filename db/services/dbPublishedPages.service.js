const db = require('../models');
const Rest = require('../mixins/rest');

module.exports = {
  name: 'dbPublishedPage',
  mixins: [Rest],
  settings: {
    model: db.PublishedPage,
  },
  actions: {

    createPublishedPage: {
      params: {
        webPageId: 'number',
        domainId: 'number',
        domain: 'string',
        slug: 'string',
        html: 'string',
      },
      handler(ctx) {
        const {
          webPageId, domainId, domain, slug, html
        } = ctx.params;
        const publishedAt = Date.now();
        const publishingPage = {
          webPageId,
          domainId,
          domain,
          slug,
          publishedAt,
          html,
        };

        return this.settings.model.create(publishingPage)
          .then(() => ({ ok: true }))
          .catch((err) => {
            this.logger.error('ERROR CREATE PUBLISH PAGE: ', err);

            return { ok: false, error: err };
          });
      },
    },

    updatePublishedPage: {
      params: {
        webPageId: 'number',
        slug: 'string',
        html: 'string',
      },
      handler(ctx) {
        const { webPageId, slug, html } = ctx.params;
        const publishedAt = new Date();

        return this.settings.model.update({ slug, html, publishedAt }, {
          where: { webPageId }
        })
          .then(() => ({ ok: true }))
          .catch((err) => {
            this.logger.error('ERROR UPDATE PUBLISH PAGE: ', err);

            return { ok: false, error: err };
          });
      },
    },

    destroyPublishedPage: {
      params: {
        webPageId: 'number',
      },
      handler(ctx) {
        const { webPageId } = ctx.params;

        return this.settings.model.destroy({
          where: { webPageId }
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
        domain: 'string',
        slug: 'string',
      },
      handler(ctx) {
        const { domain, slug } = ctx.params;

        return this.settings.model.findOne({ where: { domain, slug } })
          .then((res) => {
            if (!res) {
              return { ok: false };
            }

            return { ok: true, data: res.dataValues };
          })
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
          where: { webPageId },
        })
          .then((res) => {
            if (res) {
              return { ok: true, data: res.dataValues };
            }
            return { ok: false };
          })
          .catch((err) => {
            this.logger.error('ERROR: ', err);
            return { ok: false, error: err };
          });
      },
    },

    getAllPublishedPages: {
      handler(ctx) {
        const { domain } = ctx.params;

        return (domain
          ? this.settings.model.findAll({ where: { domain } })
          : this.settings.model.findAll({ raw: true })
        )
          .then(
            (pages) => (pages.map(({
              id, webPageId, domainId, slug, publishedAt
            }) => ({
              id,
              webPageId,
              domainId,
              domain,
              slug,
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
