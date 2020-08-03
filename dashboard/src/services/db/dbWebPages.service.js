const db = require('./models');
const Rest = require('./mixins/rest');

module.exports = {
  name: 'dbWebPages',
  mixins: [Rest],
  settings: {
    model: db.WebPage,
  },
  actions: {

    createWebPage(ctx) {
      const {
        slug, title, description
      } = ctx.params;
      const webPage = {
        slug, title, description
      };

      return this.settings.model.create(webPage)
        .then((res) => ({ ok: true, id: res.dataValues.id }))
        .catch((err) => ({ ok: false, err }));
    },

    updateWebPage(ctx) {
      const {
        slug, title, description
      } = ctx.params;

      return this.settings.model.update({ title, description }, {
        where: {
          slug,
        }
      })
        .then(() => ({ ok: true }))
        .catch((err) => ({ ok: false, err }));
    },

    deleteWebPage(ctx) {
      const { slug } = ctx.params;

      return this.broker.call('publish.isPublished', { slug })
        .then((res) => {
          if (res.ok) {
            return { ok: false, err: 'Published Page could not be deleted' };
          }

          return this.settings.model.destroy({
            where: {
              slug,
            }
          })
            .then(() => ({ ok: true }))
            .catch((err) => ({ ok: false, err }));
        });
    },

    getWebPageBySlug(ctx) {
      const { slug } = ctx.params;

      return this.settings.model.findOne({
        where: {
          slug,
        },
      })
        .then((res) => ({ ok: true, data: res.dataValues }))
        .catch((err) => ({ ok: false, err }));
    },

    getWebPageById(ctx) {
      const { id } = ctx.params;

      return this.settings.model.findOne({
        where: {
          id,
        },
      })
        .then(() => ({ ok: true }))
        .catch((err) => ({ ok: false, err }));
    },

    getAllWebPages() {
      return this.settings.model.findAll({ raw: true })
        .then(
          (pages) => (pages.map(({
            id, slug, isHomePage, title
          }) => ({
            id,
            slug,
            isHomePage,
            title,
          })))
        )
        .then((pages) => ({ ok: true, pages }))
        .catch((err) => ({ ok: false, err }));
    },

    temp: {
      handler() {
        return this.settings.model.findAll({ raw: true })
          .then((res) => JSON.stringify(res, null, 2));
      }
    },
  },
};
