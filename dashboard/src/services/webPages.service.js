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
        })
          .then(({ id }) => {
            if (isHomePage) {
              return this.broker.call('dbSettings.setHomePageId', {
                domain: 'localhost: 3011',
                homePageId: id
              }).then(() => ({ ok: true, id }));
            }

            return { ok: true, id };
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
          id, slug, isHomePage, title, description
        } = ctx.params;

        this.logger.info('UPDATE WEB PAGE: ', ctx.params);

        if (isHomePage) {
          return this.broker.call('dbSettings.setHomePageId', { domain: 'localhost:3011', homePageId: id })
            .then(() => this.broker.call('dbWebPages.updateWebPage', {
              slug, title, description
            }));
        }

        return this.broker.call('dbWebPages.updateWebPage', {
          slug, title, description
        });
      },
    },

    deleteWebPage: {
      params: {
        slug: 'string',
      },
      handler(ctx) {
        const { slug } = ctx.params;

        this.logger.info('DELETE WEB PAGE: ', ctx.params);

        return this.broker.call('dbWebPages.deleteWebPage', { slug })
          .then((res) => JSON.stringify(res, null, 2));
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
          .then((res) => res.pages)
          .then((pages) => ({ ok: true, pages }));
      },
    },

    publishWebPage: {
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
          .then((html) => this.broker.call('publish.createPublishedPage', {
            id: webPage.id,
            slug,
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
          .then((html) => this.broker.call('dbPublishedPages.updatePublishedPage', {
            id: webPage.id,
            slug,
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
      params: {
        slug: 'string',
      },
      handler(ctx) {
        const { slug } = ctx.params;

        return this.broker.call('publish.destroyPublishedPage', { slug })
          .then((response) => JSON.stringify(response, null, 2))
          .catch((err) => JSON.stringify(err, null, 2));
      },
    },

    getPublishedPageData: {
      params: {
        slug: 'string',
      },
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
