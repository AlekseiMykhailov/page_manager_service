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

        this.logger.info('CREATE PUBLISHED PAGE: ', ctx.params);

        return this.broker.call('dbPublishedPages.createPublishedPage', { id, slug, html });
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

        return this.broker.call('dbPublishedPages.updatePublishedPage', { id, slug, html });
      },
    },

    destroyPublishedPage: {
      params: {
        slug: 'string',
      },
      handler(ctx) {
        const { slug } = ctx.params;

        return this.broker.call('dbPublishedPages.destroyPublishedPage', { slug });
      }
    },

    getPublishedPage: {
      params: {
        slug: 'string',
      },
      handler(ctx) {
        const { slug } = ctx.params;

        return this.broker.call('dbPublishedPages.getPublishedPageBySlug', { slug });
      },
    },

    getPublishedPageHTML: {
      params: {
        slug: 'string',
      },
      handler(ctx) {
        const { slug } = ctx.params;

        return this.broker.call('dbPublishedPages.getPublishedPageBySlug', { slug })
          .then((res) => ((res.ok) ? res.data.html : res));
      },
    },

    getPublishedHomePageHTML: {
      handler() {
        return this.broker.call('dbSettings.getHomePageId', { domain: 'localhost:3011' })
          .then((res) => {
            const { webPageId } = res;
            return this.broker.call('dbPublishedPages.getPublishedPageByWebPageId', { webPageId });
          })
          .then((res) => ((res.ok) ? res.data.html : res));
      },
    },

    getAllPublishedPages: {
      handler() {
        return this.broker.call('dbPublishedPages.getAllPublishedPages');
      },
    },

    isPublished: {
      params: {
        slug: 'string',
      },
      handler(ctx) {
        const { slug } = ctx.params;

        return this.broker.call('dbPublishedPages.getPublishedPageBySlug', { slug })
          .then((res) => ({ ok: res.ok }));
      }
    },
  }
});
