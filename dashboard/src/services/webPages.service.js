module.exports = ({
  name: 'webPages',
  actions: {
    createWebPage: {
      params: {
        title: 'string',
        slug: 'string',
        isHomePage: 'boolean',
        description: 'string',
      },
      handler(ctx) {
        const {
          slug, isHomePage, title, description
        } = ctx.params;

        return this.broker.call('dbWebPages.createWebPage', {
          slug, isHomePage, title, description
        });
      },
    },

    updateWebPage: {
      params: {
        title: 'string',
        slug: 'string',
        isHomePage: 'boolean',
        description: 'string',
      },
      handler(ctx) {
        const {
          slug, isHomePage, title, description
        } = ctx.params;

        return this.broker.call('dbWebPages.updateWebPage', {
          slug, isHomePage, title, description
        });
      },
    },

    getWebPageBySlug: {
      params: {
        slug: 'string',
      },
      handler(ctx) {
        const { slug } = ctx.params;

        return this.broker.call('dbWebPages.getWebPageBySlug', { slug });
      },
    },

    getWebPageById: {
      params: {
        id: 'number',
      },
      handler(ctx) {
        const { id } = ctx.params;

        return this.broker.call('dbWebPages.getWebPageById', { id });
      },
    },

    previewWebPage: {
      params: {
        slug: 'string',
      },
      handler(ctx) {
        const { slug } = ctx.params;
        let webPage;

        return this.broker.call('dbWebPages.getWebPageBySlug', { slug })
          .then((res) => {
            webPage = res.data;
            return this.broker.call('rows.getRowsForPage', { id: webPage.id });
          })
          .then((rows) => this.broker.call('builder.create', { webPage, rows }))
          .then((html) => JSON.stringify({ ok: true, html }, null, 2))
          .catch((err) => JSON.stringify(err, null, 2));
      },
    },

    getListWebPages: {
      handler() {
        return this.broker.call('dbWebPages.getAllWebPages')
          .then((res) => JSON.stringify(res, null, 2));
      },
    },

    publishWebPage: {
      handler(ctx) {
        const { slug } = ctx.params;
        let webPage;

        return this.broker.call('dbWebPages.getWebPageBySlug', { slug })
          .then((res) => {
            webPage = res.data;
            return this.broker.call('rows.getRowsForPage', { id: webPage.id });
          })
          .then((rows) => this.broker.call('builder.create', { webPage, rows }))
          .then((html) => this.broker.call('publish.createPublishedPage', {
            id: webPage.id,
            slug,
            isHomePage: webPage.isHomePage,
            html,
          }))
          .then((response) => JSON.stringify(response, null, 2))
          .catch((err) => {
            this.logger.error('ERROR: ', err);
            return JSON.stringify(err, null, 2);
          });
      }
    },

    updatePublishedWebPage: {
      handler(ctx) {
        const { slug } = ctx.params;
        let webPage;

        return this.broker.call('dbWebPages.getWebPageBySlug', { slug })
          .then((res) => {
            webPage = res.data;

            return this.broker.call('rows.getRowsForPage', { id: webPage.id });
          })
          .then((rows) => this.broker.call('builder.create', { webPage, rows }))
          .then((html) => this.broker.call('dbPublishedPages.updatePublishedPage', {
            id: webPage.id,
            slug,
            isHomePage: webPage.isHomePage,
            html,
          }))
          .then((response) => JSON.stringify(response, null, 2))
          .catch((err) => {
            this.logger.error('ERROR: ', err);
            return JSON.stringify(err, null, 2);
          });
      }
    },

    unPublishWebPage: {
      handler(ctx) {
        const { slug } = ctx.params;

        return this.broker.call('publish.destroyPublishedPage', { slug })
          .then((response) => JSON.stringify(response, null, 2))
          .catch((err) => JSON.stringify(err, null, 2));
      },
    },

    getPublishedPageData: {
      handler(ctx) {
        const { slug } = ctx.params;

        return this.broker.call('publish.getPublishedPage', { slug })
          .then((response) => JSON.stringify(response, null, 2))
          .catch((err) => JSON.stringify(err, null, 2));
      },
    },

    getAllPublishedPagesData: {
      handler() {
        return this.broker.call('publish.getAllPublishedPages')
          .then((response) => JSON.stringify(response, null, 2))
          .catch((err) => JSON.stringify(err, null, 2));
      }
    },
  },
});
