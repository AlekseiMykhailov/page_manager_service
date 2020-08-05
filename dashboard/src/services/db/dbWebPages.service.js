const db = require('./models');
const Rest = require('./mixins/rest');

module.exports = {
  name: 'dbWebPages',
  mixins: [Rest],
  settings: {
    model: db.WebPage,
  },
  actions: {

    createWebPage: {
      params: {
        slug: 'string',
        title: 'string',
        description: 'string',
      },
      handler(ctx) {
        const { slug, title, description } = ctx.params;
        const webPage = { slug, title, description };

        return this.settings.model.create(webPage)
          .then((res) => {
            return { ok: true, id: res.dataValues.id };
          })
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
          .catch((error) => ({ ok: false, error }));
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

            return this.settings.model.destroy({
              where: { slug }
            })
              .then(() => ({ ok: true }))
              .catch((error) => ({ ok: false, error }));
          });
      },
    },

    getWebPageBySlug: {
      params: {
        slug: 'string',
      },
      handler(ctx) {
        const { slug } = ctx.params;
        return this.settings.model.findOne({
          where: { slug },
        }).then(({ dataValues }) => {
          const {
            id, title, description
          } = dataValues;
          return {
            id, slug, title, description
          };
        }).then((data) => ({ ok: true, data }));
      },
    },

    getWebPageById: {
      params: {
        id: 'number',
      },
      handler(ctx) {
        const { id } = ctx.params;

        return this.settings.model.findOne({
          where: { id },
        })
          .then(({ dataValues }) => {
            const { slug, title, description } = dataValues;
            return {
              id, slug, title, description
            };
          })
          .then((data) => ({ ok: true, data }))
          .catch((error) => ({ ok: false, error }));
      },
    },

    getAllWebPages: {
      handler() {
        return this.settings.model.findAll({ raw: true })
          .then(
            (pages) => (pages.map(({
              id, slug, title
            }) => ({
              id, slug, title
            })))
          )
          .then((pages) => ({ ok: true, pages }))
          .catch((error) => ({ ok: false, error }));
      },
    },
  },
};
