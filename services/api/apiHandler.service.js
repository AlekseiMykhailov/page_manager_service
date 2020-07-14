const drafts = require('../../data/mock-pages.json');

module.exports = {
  name: 'apiHandler',
  actions: {
    createDraft(ctx) {
      console.log('create draft');
      return this.broker.call('draft.add', { drafts });
    },
    updateDraft(ctx) {
      console.log('update draft');
    },
    getDraft(ctx) {
      return this.broker.call('draft.get', ctx.params);
    },
    listDraft() {
      return this.broker.call('draft.list');
    },


    publishPage(ctx) {
      console.log('publish page');
    },
    getPage(ctx) {
      return this.broker.call('page.get', ctx.params);
    }
  }
};
