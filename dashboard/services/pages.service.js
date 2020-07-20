const mockPages = require('../data/mock-pages.json');

class PagesStore {
  constructor(pages) {
    this.pages = pages;
  }

  create(draft) {
    const { slug } = draft;
    const inStorage = this.pages.find(page => page.slug === slug);

    if (inStorage) {
      throw 'This slug already used';
    }

    this.pages = [...this.pages, draft];

    return this.getBySlug(slug);
  }

  update(updatingPage) {
    const { slug } = updatingPage;

    this.pages = [...this.pages].map(page => {
      if (page.slug === slug) {
        return {
          ...page,
          ...updatingPage,
        };
      }

      return page;
    });

    return this.getBySlug(slug);
  }

  getBySlug(slug) {
    return this.pages.find(page => page.slug === slug);
  }

  getAll() {
    return this.pages;
  }

  delete(slug) {
    this.pages = this.pages.filter(page => page.slug === slug);
  }
}

const webPagesStore = new PagesStore([...mockPages, { id: 3, slug: 'test', title: 'test'}]);

module.exports = ({
  name: 'pages',
  actions: {
    createWebPage(ctx) {
      const { title, slug, description } = ctx.params;
      const webPage = { slug, title, description };

      this.logger.info('CREATE WEB PAGE: ', ctx.params);

      webPagesStore.create(webPage);

      const previews = webPagesStore.getAll()
        .map(({ title, slug }) => ({
          title,
          slug,
          section: 'preview',
        }));


      this.logger.info('LIST PREVIEWS: ', previews);

      return this.broker.call('dashboard.editWebPage', webPage);
    },

    updateWebPage(ctx) {
      this.logger.info('UPDATE WEB PAGE: ', ctx.params);

      webPagesStore.update(ctx.params);

      return this.broker.call('dashboard.editWebPage', ctx.params);
    },

    getWebPage(ctx) {
      const { slug } = ctx.params;

      return webPagesStore.getBySlug(slug);
    },

    previewWebPage(ctx) {
      const { slug } = ctx.params;
      const page = webPagesStore.getBySlug(slug);

      // this.logger.info("Draft.Preview: ", domain, slug);

      return this.broker.call('builder.create', page);
    },

    listWebPages() {
      return webPagesStore.getAll()
        .map(({ title, slug }) => ({ title, slug }));

    },
  }
});
