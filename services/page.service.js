const drafts = require('../data/mock-pages.json');

class PageStore {
  constructor(pages) {
    this.pages = pages;
  }

  add(page) {}

  update(page) {}

  get(domain, slug) {
    return this.pages.find(page => (
      page.domain === domain && page.slug === slug
    ));
  }
}

const appPageStore = new PageStore([...drafts, { domain: 'localhost:3000', slug: 'test', title: 'test'}]);

module.exports = ({
  name: 'page',
  actions: {
    get(ctx) {
      const { domain, slug } = ctx.params;

      return appPageStore.get(domain, slug);
    },
  }
});
