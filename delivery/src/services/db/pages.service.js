const db = require('./models');
const Rest = require('./mixins/rest');

const PUBLISHED_SERVER = 'http://localhost:5000';

module.exports = {
  name: 'dbPages',
  mixins: [Rest],
  settings: {
    model: db.Page,
  },
  actions: {
    getBySlug(ctx) {
      return this.settings.model.findOne({
        where: {
          slug: ctx.params.slug,
        },
      })
        .then((res) => ({ ok: true, data: res.dataValues }))
        .catch((err) => ({ ok: false, err }));
    },

    getHtml(ctx) {
      return this.broker.call('dbPages.getBySlug', ctx.params)
        .then((res) => ((res.ok) ? res.data.html : res));
    },

    getAll() {
      return this.settings.model.findAll({ raw: true })
        .then(
          (pages) => (pages.map(({
            id, uuid, slug, publishedAt
          }) => ({
            id,
            uuid,
            url: `${PUBLISHED_SERVER}/${slug}`,
            publishedAt,
          })))
        )
        .then((pages) => ({ ok: true, pages }))
        .catch((err) => ({ ok: false, err }));
    },

    isPublished(ctx) {
      const { slug } = ctx.params;

      return this.broker.call('dbPages.getBySlug', { slug })
        .then((res) => {
          if (res.ok) {
            const { uuid, publishedAt } = res.data;
            return {
              ok: true,
              data: {
                id: uuid,
                publishedAt,
                url: `${PUBLISHED_SERVER}/${slug}`,
              }
            };
          }

          return { ok: false };
        });
    },

    create(ctx) {
      const {
        id, slug, html
      } = ctx.params;
      const publishedAt = Date.now();
      const publishingPage = {
        uuid: id,
        slug,
        publishedAt,
        html,
      };

      return this.broker.call('dbPages.getBySlug', { slug })
        .then((res) => {
          if (res.ok) {
            throw new Error('Page with this slug already published');
          }

          return this.settings.model.create(publishingPage);
        })
        .then(() => ({ ok: true, data: { url: `${PUBLISHED_SERVER}/${slug}`, publishedAt } }))
        .catch((err) => ({ ok: false, err }));
    },

    update(ctx) {
      const {
        slug, html
      } = ctx.params;
      const publishedAt = Date.now();

      return this.settings.model.update({ publishedAt, html }, {
        where: {
          slug,
        }
      })
        .then(() => ({ ok: true, data: { url: `${PUBLISHED_SERVER}/${slug}`, publishedAt } }))
        .catch((err) => ({ ok: false, err }));
    },

    destroy(ctx) {
      return this.settings.model.destroy({
        where: {
          slug: ctx.params.slug,
        }
      })
        .then(() => ({ ok: true }))
        .catch((err) => ({ ok: false, err }));
    }
  },
};
