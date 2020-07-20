const drafts = require('../data/mock-pages.json');

class PageStore {
  constructor(pages) {
    this.pages = pages;
  }

  add(page) {}

  update(page) {}

  get(domain, slug) {
    if (domain && slug) {
      const page = this.pages.find(page => page.domain === domain && page.slug === slug);

      return (page)
        ? this.toJSON(page)
        : `Page [${slug}] for domain: [${domain}] not found`;
    }

    if (domain) {
      const pages = this.pages.filter(page => page.domain === domain);

      return (pages.length > 0)
        ? this.toJSON(pages)
        : `Pages for domain: [${domain}] not found`;
    }

    return (this.pages.length > 0)
      ? this.toJSON(this.pages)
      : 'Pages not found';
  }

  toJSON(value) {
    return JSON.stringify(value, null, 2);
  }
}

const appPageStore = new PageStore([...drafts, { slug: 'test', title: 'test'}]);

module.exports = ({
  name: 'publish',
  actions: {
    getWebPage(ctx) {
      const { slug } = ctx.params;

      return appPageStore.get(slug);
    },
  }
});
