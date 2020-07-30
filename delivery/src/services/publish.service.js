module.exports = ({
  name: 'publish',
  actions: {
    getPublished: {
      params: {},
      handler(ctx) {
        const { slug } = ctx.params;

        if (!slug) {
          return this.broker.call('dbPages.getAll')
            .then((pages) => JSON.stringify(pages, null, 2));
        }

        return this.broker.call('dbPages.getBySlug', { slug })
          .then((page) => JSON.stringify(page, null, 2));
      },
    },

    addPublishedPage: {
      params: {},
      handler(ctx) {
        const { id, slug, html } = ctx.params;

        return this.broker.call('dbPages.create', { id, slug, html });
      },
    },

    updatePublishedPage: {
      params: {},
      handler(ctx) {
        const { id, slug, html } = ctx.params;

        return this.broker.call('dbPages.update', { id, slug, html });
      },
    },

    destroyPublishedPage: {
      params: {},
      handler(ctx) {
        const { slug } = ctx.params;

        return this.broker.call('dbPages.destroy', { slug });
      }
    },

  }
});
