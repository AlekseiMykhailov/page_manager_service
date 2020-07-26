const FIELD_TYPES = {
  text: 'text',
  email: 'email',
  url: 'url',
  file: 'file',
  select: 'select',
};

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
        return this.broker.call('pages.getListWebPages');
      },
    },

    createWebPage: {
      handler(ctx) {
        return this.broker.call('pages.createWebPage', ctx.params);
      },
    },

    editWebPage: {
      params: {
        slug: { type: 'string' },
      },
      handler(ctx) {
        const { slug } = ctx.params;
        let webPage;

        this.logger.info('EDIT WEB PAGE', ctx.params);

        return this.broker.call('pages.getWebPageBySlug', { slug })
          .then(res => {
            webPage = res;

            this.logger.info('EDITING WEB PAGE: ', slug, webPage);

            return this.broker.call('rows.getRowsForPage', { id: webPage.id });
          })
          .then(rows => {
            return JSON.stringify({ ok: true, webPage, rows }, null, 2);
          });
      }
    }
  },
});
