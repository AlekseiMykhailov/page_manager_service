module.exports = ({
  name: 'publish',
  actions: {

    createPublishedPage: {
      params: {
        id: 'number',
        slug: 'string',
        html: 'string',
      },
      handler(ctx) {
        const { id, slug, html } = ctx.params;

        this.logger.info('CREATE PUBLISHED PAGE: ', id, slug);

        return this.broker.call('dbPublishedPage.createPublishedPage', { id, slug, html })
          .catch((err) => {
            this.logger.error('ERROR: ', err);
            return { ok: false, error: err };
          });
      },
    },

    updatePublishedPage: {
      params: {
        id: 'number',
        slug: 'string',
        html: 'string',
      },
      handler(ctx) {
        const { id, slug, html } = ctx.params;

        this.logger.info('UPDATE PUBLISHED PAGE: ', ctx.params);

        return this.broker.call('dbPublishedPage.updatePublishedPage', { id, slug, html })
          .catch((err) => {
            this.logger.error('ERROR: ', err);
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

        return this.broker.call('dbPublishedPage.destroyPublishedPage', { slug })
          .catch((err) => {
            this.logger.error('ERROR: ', err);
            return { ok: false, error: err };
          });
      }
    },

    getPublishedPage: {
      params: {
        slug: 'string',
      },
      handler(ctx) {
        const { slug } = ctx.params;

        return this.broker.call('dbPublishedPage.getPublishedPageBySlug', { slug })
          .catch((err) => {
            this.logger.error('ERROR: ', err);
            return { ok: false, error: err };
          });
      },
    },

    getPublishedPageHTML: {
      params: {
        slug: 'string',
      },
      handler(ctx) {
        const { slug } = ctx.params;

        return this.broker.call('dbPublishedPage.getPublishedPageBySlug', { slug })
          .then((res) => ((res.ok) ? res.data.html : res))
          .catch((err) => {
            this.logger.error('ERROR: ', err);
            return { ok: false, error: err };
          });
      },
    },

    getPublishedHomePageHTML: {
      handler() {
        return this.broker.call('dbDomainSettings.getHomePageId', { domain: 'localhost:3011' })
          .then((res) => {
            const { webPageId } = res;
            return this.broker.call('dbPublishedPage.getPublishedPageByWebPageId', { webPageId });
          })
          .then((res) => ((res.ok) ? res.data.html : res))
          .catch((err) => {
            this.logger.error('ERROR: ', err);
            return { ok: false, error: err };
          });
      },
    },

    getAllPublishedPages: {
      handler() {
        return this.broker.call('dbPublishedPage.getAllPublishedPages')
          .catch((err) => {
            this.logger.error('ERROR: ', err);
            return { ok: false, error: err };
          });
      },
    },

    isPublished: {
      params: {
        slug: 'string',
      },
      handler(ctx) {
        const { slug } = ctx.params;

        return this.broker.call('dbPublishedPage.getPublishedPageBySlug', { slug })
          .then((res) => ({ ok: res.ok }))
          .catch((err) => {
            this.logger.error('ERROR: ', err);
            return { ok: false, error: err };
          });
      }
    },
  }
});
