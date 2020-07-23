const FIELD_TYPES = {
  text: 'text',
  email: 'email',
  url: 'url',
  file: 'file',
  select: 'select',
};

const mainNav = [
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
        const res = {
          ok: true,
          nav: [
            ...mainNav,
          ],
        };
        return JSON.stringify(res, null, 2);
      },
    },

    dashboard: {
      handler() {
        return JSON.stringify(dashboardSections, null, 2);
        // return this.broker.call('builder.createList', {
        //   title: 'Dashboard',
        //   items: dashboardSections,
        // });
      },
    },

    listWebPages: {
      handler() {
        return this.broker.call('pages.getListWebPages');

        // return this.broker.call('pages.getListWebPages')
        //   .then(res => this.broker.call('builder.createList', {
        //     title: 'List of Web Pages',
        //     items: res.map(({ title, slug }) => ({
        //       title,
        //       slug,
        //       editLink: true,
        //       previewLink: true,
        //       section: 'pages',
        //     })),
        //   }));
      },
    },

    createWebPage: {
      handler() {
        return this.broker.call('builder.createAddPageForm', {
          actionURL: '/pages/create',
          fields: [
            {
              name: 'title',
              label: 'Title',
              placeholder: 'Title of the page',
              require: true,
              type: FIELD_TYPES.text,
            },
            {
              name: 'slug',
              label: 'Slug',
              placeholder: 'People friendly URL of the page',
              require: true,
              type: FIELD_TYPES.text,
            },
            {
              name: 'description',
              label: 'Description',
              placeholder: 'Description of the page',
              require: true,
              type: FIELD_TYPES.text,
            },
          ],
          fieldTypes: FIELD_TYPES,
        });
      },
    },

    editWebPage: {
      params: {
        slug: { type: 'string' },
      },
      handler(ctx) {
        const { slug } = ctx.params;
        let webPage;

        return this.broker.call('pages.getWebPage', { slug })
          .then(res => {
            webPage = res;
            return this.broker.call('rows.getRowsForPage', { id: webPage.id });
          })
          .then(rows => {
            return JSON.stringify({ ok: true, webPage, rows }, null, 2);
          });
        // .then(rows => this.broker.call('builder.createFormPageEdit', {
        //   webPage,
        //   rows,
        //   fieldTypes: FIELD_TYPES,
        // }));
      }
    }
  },
});
