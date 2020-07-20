const { FIELD_TYPES } = require('../../config/constants');

module.exports = ({
  name: 'dashboard',
  actions: {
    dashboard() {
      const items = [
        { slug: 'pages', title: 'WebPages' },
        { slug: 'pages/create', title: 'Create Web Page' },
      ];

      this.broker.call('rows.getRows').then(res => console.log('MOCK ROWS ', res));

      return this.broker.call('builder.createList', {
        title: 'Dashboard',
        items,
      });
    },

    listWebPages() {
      return this.broker.call('pages.listWebPages')
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
      const { domain, slug } = ctx.params;

      return this.broker.call('pages.getWebPage', { domain, slug })
        .then(res => this.broker.call('builder.createEditPageForm', {
          title: 'Edit Web Page',
          slug,
          fields: res,
        }));
    },
  },
});
