module.exports = ({
  name: 'publish',
  actions: {

    getPublishedPage: {
      params: {},
      handler(ctx) {
        const { slug } = ctx.params;

        return this.broker.call('dbPublishedPages.getPageBySlug', { slug });
      },
    },

    getAllPublishedPages: {
      params: {},
      handler() {
        return this.broker.call('dbPublishedPages.getAllPublishedPages');
      },
    },

    createPublishedPage: {
      params: {},
      handler(ctx) {
        const {
          id, slug, html
        } = ctx.params;

        this.logger.info('CREATE PUBLISHED PAGE: ', ctx.params);

        return this.broker.call('dbPublishedPages.createPublishedPage', {
          id, slug, html
        });
      },
    },

    updatePublishedPage: {
      params: {},
      handler(ctx) {
        const {
          id, slug, html
        } = ctx.params;

        this.logger.info('UPDATE PUBLISHED PAGE: ', ctx.params);

        return this.broker.call('dbPublishedPages.updatePublishedPage', {
          id, slug, html
        });
      },
    },

    destroyPublishedPage: {
      params: {},
      handler(ctx) {
        const { slug } = ctx.params;

        return this.broker.call('dbPublishedPages.destroyPublishedPage', { slug });
      }
    },

  }
});
