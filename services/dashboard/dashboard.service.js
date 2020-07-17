module.exports = ({
  name: 'dashboard',
  actions: {
    dashboard() {
      const title = 'Dashboard';
      const list = [
        { slug: 'drafts', title: 'Drafts'},
        { slug: 'preview', title: 'Preview Drafts'},
        { slug: 'add', title: 'Add Draft'},
      ];

      return this.broker.call('builder.createList', {
        title,
        h1: title,
        list,
      });
    },
    addDraft() {
      const title = 'Add Draft';

      return this.broker.call('builder.createForm', {
        title,
        h1: title,
      });
    },
    draftList() {
      return this.broker.call('draft.list')
        .then(res => this.broker.call('builder.createList', {
          title: 'Draft List',
          h1: 'Draft List',
          list: res.map(draft => ({
            title: draft.title,
            domain: draft.domain,
            slug: draft.slug,
            section: 'drafts',
          })),
        }));
    },
    draftEdit(ctx) {
      const { domain, slug } = ctx.params;

      return this.broker.call('draft.get', { domain, slug })
        .then(res => this.broker.call('builder.createEditForm', {
          h1: 'Edit Draft',
          title: res.title,
          domain: res.domain,
          slug: res.slug,
          descr: res.descr,
          fields: res.rows,
        }));
    },
  },
});
