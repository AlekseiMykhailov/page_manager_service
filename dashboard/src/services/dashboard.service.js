const FIELD_TYPES = {
  text: 'text',
  email: 'email',
  url: 'url',
  file: 'file',
  select: 'select',
};

module.exports = ({
  name: 'dashboard',
  actions: {
    dashboard() {
      const items = [
        { slug: 'pages', title: 'WebPages' },
        { slug: 'pages/create', title: 'Create Web Page' },
      ];

      return this.broker.call('builder.createList', {
        title: 'Dashboard',
        items,
      });
    },

    listWebPages() {
      return this.broker.call('pages.getListWebPages')
        .then(res => this.broker.call('builder.createList', {
          title: 'List of Web Pages',
          items: res.map(({ title, slug }) => ({
            title,
            slug,
            editLink: true,
            previewLink: true,
            section: 'pages',
          })),
        }));
    },

    createWebPage() {
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

    editWebPage(ctx) {
      const { slug } = ctx.params;
      let webPage;

      return this.broker.call('pages.getWebPage', { slug })
        .then(res => {
          webPage = res;
          return this.broker.call('rows.getPageRows', { id: webPage.id });
        })
        .then(rows => this.broker.call('builder.createEditPageForm', {
          webPage,
          rows,
          fieldTypes: FIELD_TYPES,
        }));
    },
  },
});
