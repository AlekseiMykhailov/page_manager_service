const { v4 } = require('uuid');

const mockPages = require('../../data/mock-pages.json');

class WebPage {
  constructor(slug, title, description) {
    this.id = v4();
    this.slug = slug;
    this.title = title;
    this.description = description;
  }
}

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

  update(pageFields) {
    const { slug } = pageFields;

    this.pages = [...this.pages].map(page => {
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
    this.pages = this.pages.filter(page => page.slug === slug);
  }

  getBySlug(slug) {
    return this.pages.find(page => page.slug === slug);
  }

  getById(id) {
    return this.pages.find(page => page.id === id);
  }

  getAll() {
    return this.pages;
  }
}

const webPagesStore = new PagesStore([...mockPages, { id: '3', slug: 'test', title: 'test'}]);

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
        const { title, slug, description } = ctx.params;
        const newWebPage = new WebPage(title, slug, description);

        webPagesStore.create(newWebPage);

        this.logger.info('WEB PAGE CREATED: ', ctx.params);

        return this.broker.call('dashboard.editWebPage', newWebPage);
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

    getWebPage: {
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

        this.logger.info('getWebPageById ctx.params: ', ctx.params);
        this.logger.info('getWebPageById return: ', webPagesStore.getById(id));

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
          .then(rows => {
            return this.broker.call('builder.create', { webPage, rows });
          });
      },
    },

    getListWebPages: {
      handler() {
        return webPagesStore.getAll()
          .map(({ title, slug }) => ({ title, slug }));
      },
    },
  }
});
