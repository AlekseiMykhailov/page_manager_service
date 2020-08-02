const db = require('./models');
const Rest = require('./mixins/rest');

const PUBLISHED_SERVER = 'http://localhost:3011';

module.exports = {
  name: 'dbPublishedPages',
  mixins: [Rest],
  settings: {
    model: db.PublishedPage,
  },
  actions: {

    createPublishedPage(ctx) {
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
          this.logger.error('ERROR: ', err);
          return JSON.stringify(err, null, 2);
        });
    },

    updatePublishedPage(ctx) {
      const { slug, html } = ctx.params;
      const publishedAt = Date.now();

      return this.settings.model.update({ publishedAt, html }, {
        where: {
          slug,
        }
      })
        .then(() => ({ ok: true, data: { url: `${PUBLISHED_SERVER}/${slug}`, publishedAt } }))
        .catch((err) => {
          this.logger.error('ERROR: ', err);
          return JSON.stringify(err, null, 2);
        });
    },

    destroyPublishedPage(ctx) {
      const { slug } = ctx.params;

      return this.settings.model.destroy({
        where: {
          slug,
        }
      })
        .then(() => ({ ok: true }))
        .catch((err) => ({ ok: false, err }));
    },

    getPageBySlug(ctx) {
      const { slug } = ctx.params;

      return this.settings.model.findOne({
        where: {
          slug,
        },
      })
        .then((res) => ({ ok: true, data: { ...res.dataValues, url: `${PUBLISHED_SERVER}/${slug}`} }))
        .catch((err) => ({ ok: false, err }));
    },

    getHomePage() {
      return this.broker.call('dbSettings.getHomePageId', { domain: 'localhost:3011' })
        .then((res) => this.settings.model.findOne({
          where: {
            webPageId: res.webPageId,
          },
        }))
        .then((res) => ({ ok: true, data: res.dataValues }))
        .catch((err) => ({ ok: false, err }));
    },

    getHomePageHtml(ctx) {
      const { slug } = ctx.params;

      return this.broker.call('dbPublishedPages.getHomePage', { slug })
        .then((res) => ((res.ok) ? res.data.html : res));
    },

    getPageHtml(ctx) {
      const { slug } = ctx.params;

      return this.broker.call('dbPublishedPages.getPageBySlug', { slug })
        .then((res) => ((res.ok) ? res.data.html : res));
    },

    getAllPublishedPages() {
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
        .catch((err) => ({ ok: false, err }));
    },

    isPublished(ctx) {
      const { slug } = ctx.params;

      return this.broker.call('dbPublishedPages.getPageBySlug', { slug })
        .then((res) => {
          if (res.ok) {
            const { publishedAt } = res.data;
            return {
              ok: true,
              data: {
                publishedAt,
                slug,
                url: `${PUBLISHED_SERVER}/${slug}`,
              }
            };
          }

          return { ok: false };
        });
    },

    destroyAllPublishedPages() {
      return this.settings.model.destroy({
        where: {}
      })
        .then(() => ({ ok: true }))
        .catch((err) => ({ ok: false, err }));
    },
  },
};
