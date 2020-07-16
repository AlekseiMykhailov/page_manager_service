module.exports = ({
  name: 'dashboard',
  actions: {
    dashboard() {
      const title = 'Dashboard';
      const list = [
        { slug: 'add', title: 'Add Draft'},
        { slug: 'preview', title: 'Preview Drafts'},
      ];

      return this.broker.call('builder.createList', {
        title,
        header: title,
        list,
      });
    },
    addDraft() {
      const title = 'Add Draft';
      const fields = [
        {
          name: 'domain',
          type: 'select',
          child: [ 'http://localhost:4000/', 'http://localhost:5000/' ],
        },
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'descr',
          type: 'text',
        },
      ];

      return this.broker.call('builder.createForm', {
        title,
        header: title,
        fields,
      });
    },
    draftList() {
      return this.broker.call('draft.list')
        .then(res => this.broker.call('builder.createList', {
          title: 'Draft List',
          h1: 'Draft List',
          list: res,
        }));
    },
  },
});
