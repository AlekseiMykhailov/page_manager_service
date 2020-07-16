const drafts = require('../data/mock-pages.json');

class DraftStore {
  constructor(drafts) {
    this.drafts = drafts;
  }

  create(newDraft) {
    const { domain, slug } = newDraft;
    const inStorage = this.drafts.find(draft => (
      draft.domain === domain && draft.slug === slug
    ));

    if (inStorage) {
      throw 'This domain already has the slug';
    }

    this.drafts = [...this.drafts, newDraft];

    return this.get(domain, slug);
  }

  update(updatedDraft) {
    const { domain, slug } = updatedDraft;

    this.drafts = [this.drafts].map(draft => {
      if (draft.domain === domain && draft.slug === slug) {
        return updatedDraft;
      }

      return draft;
    });

    return this.get(domain, slug);
  }

  get(domain, slug) {
    return this.drafts.find(draft => (
      draft.domain === domain && draft.slug === slug
    ));
  }

  getAll() {
    return this.drafts;
  }

  delete(domain, slug) {
    this.drafts = this.drafts.filter(draft => (
      draft.slug === slug && draft.domain === domain
    ));
  }
}

const appDraftStore = new DraftStore([...drafts, { domain: 'localhost:3000', slug: 'test', title: 'test'}]);

module.exports = ({
  name: 'draft',
  actions: {
    add(ctx) {
      const { title, slug, descr, domain } = ctx.params;
      const newDraft = { domain, slug, title, descr };

      appDraftStore.create(newDraft);
      return this.broker.call('builder.create', newDraft);
    },
    update(ctx) {
      return appDraftStore.update(ctx.params.draft);
    },
    get(ctx) {
      const { domain, slug } = ctx.params;

      return appDraftStore.get(domain, slug);
    },
    previewList() {
      return this.broker.call('builder.createList', { list: appDraftStore.getAll()});
    },
    previewDraft(ctx) {
      const { domain, slug } = ctx.params;
      const draft = appDraftStore.get(domain, slug);

      this.logger.info("Draft.Preview: ", domain, slug);

      return this.broker.call('builder.create', draft);
    },
    list() {
      const draftsList = appDraftStore.getAll().map(draft => ({
        title: draft.title,
        domain: draft.domain,
        slug: draft.slug,
      }));

      return draftsList;
    },
  }
});
