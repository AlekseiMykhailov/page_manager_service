const mockPages = require('../../data/mock-pages.json');

class PagesStore {
  constructor(pages) {
    this.pages = pages;
  }

  add(newPage) {
    const { slug } = newPage;
    const inStorage = this.pages.find((page) => page.slug === slug);

    if (inStorage) {
      throw new Error('This slug already used');
    }

    this.pages = [...this.pages, newPage];

    return this.getBySlug(slug);
  }

  update(pageFields) {
    const { slug } = pageFields;

    this.pages = [...this.pages].map((page) => {
      if (page.slug === slug) {
        return {
          ...page,
          ...pageFields,
        };
      }

      return page;
    });

    return this.getBySlug(slug);
  }

  delete(slug) {
    this.pages = this.pages.filter((page) => page.slug === slug);
  }

  getBySlug(slug) {
    return this.pages.find((page) => page.slug === slug);
  }

  getById(id) {
    return this.pages.find((page) => page.id === id);
  }

  getAll() {
    return this.pages;
  }
}

const webPagesStore = new PagesStore([...mockPages, { id: '3', slug: 'test', title: 'test' }]);

module.exports = ({
  name: 'pages',
  actions: {
    createWebPage: {
      params: {
        title: 'string',
        slug: 'string',
        description: 'string',
      },
      handler(ctx) {
        return this.broker.call('schemas.constructWebPage', ctx.params)
          .then((webPage) => {
            webPagesStore.add(webPage);
            return webPage.id;
          })
          .then((id) => webPagesStore.getById(id))
          .then((webPage) => JSON.stringify({ ok: true, webPageId: webPage.id }));
      },
    },

    updateWebPage: {
      params: {
        title: 'string',
        slug: 'string',
        description: 'string',
      },
      handler(ctx) {
        webPagesStore.update(ctx.params);

        this.logger.info('WEB PAGE UPDATED: ', ctx.params);

        return this.broker.call('dashboard.editWebPage', ctx.params);
      },
    },

    getWebPageBySlug: {
      params: {
        slug: 'string',
      },
      handler(ctx) {
        const { slug } = ctx.params;

        return webPagesStore.getBySlug(slug);
      },
    },

    getWebPageById: {
      params: {
        id: 'string',
      },
      handler(ctx) {
        const { id } = ctx.params;

        return webPagesStore.getById(id);
      },
    },

    previewWebPage: {
      params: {
        slug: 'string',
      },
      handler(ctx) {
        const { slug } = ctx.params;
        const webPage = webPagesStore.getBySlug(slug);

        return this.broker.call('rows.getRowsForPage', { id: webPage.id })
          .then((rows) => this.broker.call('builder.create', { webPage, rows }))
          .then((html) => JSON.stringify({ ok: true, html }, null, 2));
      },
    },

    getListWebPages: {
      handler() {
        const webPagesList = webPagesStore.getAll().map((page) => {
          const { id, title, slug } = page;
          const pageInfo = { id, title, slug };
          const isPublished = Object.prototype.hasOwnProperty.call(page, 'published');

          if (isPublished) {
            pageInfo.published = { ...page.published };
          }

          return pageInfo;
        });

        return JSON.stringify({ ok: true, pages: [...webPagesList] }, null, 2);
      },
    },

    publishWebPage: {
      handler(ctx) {
        const { slug } = ctx.params;
        const webPage = webPagesStore.getBySlug(slug);
        const { id } = webPage;

        return this.broker.call('rows.getRowsForPage', { id })
          .then((rows) => this.broker.call('builder.create', { webPage, rows }))
          .then((html) => this.broker.call('dbPages.create', { id, slug, html }))
          .then((response) => JSON.stringify(response, null, 2));
      }
    },

    updatePublishedWebPage: {
      handler(ctx) {
        const { slug } = ctx.params;
        const webPage = webPagesStore.getBySlug(slug);
        const { id } = webPage;

        return this.broker.call('rows.getRowsForPage', { id })
          .then((rows) => this.broker.call('builder.create', { webPage, rows }))
          .then((html) => this.broker.call('publish.updatePublishedPage', { id, slug, html }))
          .then((response) => JSON.stringify(response, null, 2));
      }
    },

    unPublishWebPage: {
      handler(ctx) {
        const { slug } = ctx.params;

        return this.broker.call('publish.destroyPublishedPage', { slug })
          .then((response) => JSON.stringify(response, null, 2));
      },
    },
  },
});
