const nav = [
  { id: '1', path: '/', title: 'Dashboard' },
  { id: '2', path: '/pages', title: 'Pages' },
  { id: '3', path: '/create-page', title: 'Create Web Page' },
];

module.exports = ({
  name: 'dashboard',
  actions: {

    nav: {
      handler() {
        return JSON.stringify({ ok: true, nav }, null, 2);
      },
    },

    listWebPages: {
      handler() {
        return this.broker.call('webPages.getListWebPages')
          .then(({ pages }) => JSON.stringify({
            ok: true,
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
        const response = {};

        return this.broker.call('webPages.getWebPageBySlug', { slug })
          .then((webPage) => { response.webPage = webPage.data; })
          .then(() => this.broker.call('dbSettings.getHomePageId', { domain: 'localhost:3011' }))
          .then((res) => { response.webPage.isHomePage = (response.webPage.id === res.webPageId); })
          .then(() => this.broker.call('rows.getRowsForWebPage', { webPageId: response.webPage.id }))
          .then((rows) => {
            response.rows = rows;
            return rows.map((row) => row.id);
          })
          .then((rowIds) => this.broker.call('dbFields.getFieldsByRowId', { rowIds }))
          .then(({ fields }) => response.rows.map((row) => ({
            ...row,
            fields: fields.filter((field) => field.rowId === row.id),
          })))
          .then((rows) => { response.rows = rows; })
          .then(() => JSON.stringify({
            ok: true,
            webPage: response.webPage,
            rows: response.rows,
          }, null, 2));
      },
    }
  },
});
