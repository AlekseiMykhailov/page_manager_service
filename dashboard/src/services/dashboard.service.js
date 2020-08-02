const nav = [
  { id: '1', path: '/', title: 'Dashboard' },
  { id: '2', path: '/pages', title: 'Pages' },
  { id: '3', path: '/create-page', title: 'Create Web Page' },
];

const dashboardSections = [
  { path: '/pages', title: 'WebPages' },
  { path: '/create-page', title: 'Create Web Page' },
];

module.exports = ({
  name: 'dashboard',
  actions: {

    nav: {
      handler() {
        return JSON.stringify({ ok: true, nav }, null, 2);
      },
    },

    dashboard: {
      handler() {
        return JSON.stringify({ ok: true, dashboardSections }, null, 2);
      },
    },

    listWebPages: {
      handler() {
        let pages;

        return this.broker.call('webPages.getListWebPages')
          .then((res) => { pages = res.pages; })
          .then(() => this.broker.call('dbSettings.getHomePageId', { domain: 'localhost:3011' }))
          .then((res) => JSON.stringify({
            ok: true,
            homePageId: res.webPageId,
            pages,
          }, null, 2));
      },
    },

    editWebPage: {
      params: {
        slug: { type: 'string' },
      },
      handler(ctx) {
        const { slug } = ctx.params;
        let webPage;

        return this.broker.call('webPages.getWebPageBySlug', { slug })
          .then((res) => { webPage = res.data; })
          .then(() => this.broker.call('dbSettings.getHomePageId', { domain: 'localhost:3011' }))
          .then((res) => { webPage.isHomePage = (webPage.id === res.webPageId); })
          .then(() => this.broker.call('rows.getRowsForPage', { id: webPage.id }))
          .then((rows) => JSON.stringify({ ok: true, webPage, rows }, null, 2));
      },
    }
  },
});
