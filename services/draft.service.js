const drafts = require('../data/mock-pages.json');

const storage = {
  drafts: [...drafts, { domain: 'localhost:3000', slug: 'test', title: 'test'}],
};

const notFound = {
  title: 'Draft Not Found',
};

module.exports = ({
  name: 'draft',
  actions: {
    add(ctx) {
      const { title, slug, descr, domain } = ctx.params;
      const newDraft = { domain, slug, title, descr };
      const inStorage = storage.drafts.find(draft => draft.slug === slug && draft.domain === domain);

      if (inStorage) {
        throw 'This slug already in the storage';
      }

      storage.drafts = [... storage.drafts, newDraft];

      return newDraft;
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

      return draft;
    },
    preview(ctx) {
      const draft = storage.drafts.find(draft => draft.slug === ctx.params.slug) || notFound;

      return this.broker.call('builder.create', draft);
    },
    list() {
      console.log(storage.drafts);
      const draftsList = storage.drafts.map(draft => ({
        title: draft.title,
        domain: draft.domain,
        slug: draft.slug,
      }));

      return draftsList;
    },
  }
});
