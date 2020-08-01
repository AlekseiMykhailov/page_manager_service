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
      const {
        id, slug, isHomePage, html
      } = ctx.params;
      const publishedAt = Date.now();
      const publishingPage = {
        webPageId: id,
        slug,
        isHomePage,
        publishedAt,
        html,
      };

      if (isHomePage) {
        this.logger.info('CHANGE HOMEPAGE - CREATE');
        this.settings.model.update({ isHomePage: false }, {
          where: {
            isHomePage,
          }
        });
      }

      return this.settings.model.create(publishingPage)
        .then(() => ({ ok: true, data: { url: `${PUBLISHED_SERVER}/${slug}`, publishedAt } }))
        .catch((err) => {
          this.logger.error('ERROR: ', err);
          return JSON.stringify(err, null, 2);
        });
    },

    updatePublishedPage(ctx) {
      const {
        slug, isHomePage, html
      } = ctx.params;
      const publishedAt = Date.now();

      this.logger.info('CHANGE HOMEPAGE - UPDATE: ', isHomePage);
      if (isHomePage) {
        this.settings.model.update({ isHomePage: false }, {
          where: {
            isHomePage,
          }
        });
      }

      return this.settings.model.update({ publishedAt, isHomePage, html }, {
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
      return this.settings.model.destroy({
        where: {
          slug: ctx.params.slug,
        }
      })
        .then(() => ({ ok: true }))
        .catch((err) => ({ ok: false, err }));
    },

    getPageBySlug(ctx) {
      return this.settings.model.findOne({
        where: {
          slug: ctx.params.slug,
        },
      })
        .then((res) => ({ ok: true, data: res.dataValues }))
        .catch((err) => ({ ok: false, err }));
    },

    getHomePage() {
      return this.settings.model.findOne({
        where: {
          isHomePage: true,
        },
      })
        .then((res) => ({ ok: true, data: res.dataValues }))
        .catch((err) => ({ ok: false, err }));
    },

    getHomePageHtml(ctx) {
      return this.broker.call('dbPublishedPages.getHomePage', ctx.params)
        .then((res) => ((res.ok) ? res.data.html : res));
    },

    getPageHtml(ctx) {
      return this.broker.call('dbPublishedPages.getPageBySlug', ctx.params)
        .then((res) => ((res.ok) ? res.data.html : res));
    },

    getAllPublishedPages() {
      return this.settings.model.findAll({ raw: true })
        .then(
          (pages) => (pages.map(({
            id, webPageId, slug, isHomePage, publishedAt
          }) => ({
            id,
            webPageId,
            slug,
            isHomePage,
            url: `${PUBLISHED_SERVER}/${slug}`,
            publishedAt,
          })))
        )
        .then((pages) => (JSON.stringify({ ok: true, pages }, null, 2)))
        .catch((err) => (JSON.stringify({ ok: false, err }, null, 2)));
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
