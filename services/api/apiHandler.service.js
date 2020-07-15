const drafts = require('../../data/mock-pages.json');

module.exports = {
  name: 'apiHandler',
  actions: {
    createDraft(ctx) {
      this.logger.info("Creating Draft: ", ctx.params);
      return this.broker.call('draft.add', ctx.params);
    },
    updateDraft(ctx) {
      console.log('update draft');
    },
    getDraft(ctx) {
      return this.broker.call('draft.get', ctx.params);
    },
    previewDraft(ctx) {
      return this.broker.call('draft.preview', ctx.params);
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
