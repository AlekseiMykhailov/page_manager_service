const drafts = require('../data/mock-pages.json');

const storage = {
  drafts: [...drafts],
};

const notFound = {
  title: 'Draft Not Found',
};

module.exports = ({
  name: 'draft',
  actions: {
    add(ctx) {
      // storage.drafts = [...storage.drafts, ctx.params.draft];
      storage.drafts = [...ctx.params.drafts];
      return storage.drafts[storage.draft.length - 1];
    },
    update(ctx) {
      storage.drafts = storage.drafts.map(draft => {
        if (draft.slug !== ctx.params.draft.slug) {
          return draft;
        }
        return { ...ctx.params.draft };
      });
    },
    get(ctx) {
      const draft = storage.drafts.find(draft => draft.slug === ctx.params.slug) || notFound;
      return this.broker.call('builder.create', draft);
    },
    list() {
      return storage.drafts.map(draft => draft.title).join(', ');
    },
  }
});
