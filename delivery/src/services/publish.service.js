module.exports = ({
  name: 'publish',
  actions: {

    createPublishedPage: {
      params: {
        webPageId: 'number',
        domainId: 'number',
        domain: 'string',
        slug: 'string',
        html: 'string',
      },
      handler(ctx) {
        const {
          webPageId, domainId, domain, slug, html
        } = ctx.params;

        return this.broker.call('dbPublishedPage.createPublishedPage', {
          webPageId, domainId, domain, slug, html
        })
          .catch((err) => {
            this.logger.error('ERROR: ', err);
            return { ok: false, error: err };
          });
      },
    },

    updatePublishedPage: {
      params: {
        webPageId: 'number',
        domainId: 'number', 
        domain: 'string',
        slug: 'string',
        html: 'string',
      },
      handler(ctx) {
        const {
          webPageId, domainId, domain, slug, html
        } = ctx.params;

        return this.broker.call('dbPublishedPage.updatePublishedPage', {
          webPageId, domainId, domain, slug, html
        })
          .catch((err) => {
            this.logger.error('ERROR: ', err);
            return { ok: false, error: err };
          });
      },
    },

    destroyPublishedPage: {
      params: {
        webPageId: 'number',
      },
      handler(ctx) {
        const { webPageId } = ctx.params;

        return this.broker.call('dbPublishedPage.destroyPublishedPage', { webPageId })
          .catch((err) => {
            this.logger.error('ERROR: ', err);
            return { ok: false, error: err };
          });
      }
    },

    getPublishedPageByWebPageId: {
      params: {
        webPageId: 'number',
      },
      handler(ctx) {
        const { webPageId } = ctx.params;

        return this.broker.call('dbPublishedPage.getPublishedPageByWebPageId', { webPageId })
          .catch((err) => {
            this.logger.error('ERROR: ', err);
            return { ok: false, error: err };
          });
      },
    },

    getPageHTML: {
      handler(ctx) {
        const { domain, slug } = ctx.params;

        if (slug) {
          return this.broker.call('publish.getPublishedPageHTML', { domain, slug });
        }

        return this.broker.call('publish.getPublishedHomePageHTML', { domain });
      }
    },

    getPublishedPageHTML: {
      params: {
        domain: 'string',
      },
      handler(ctx) {
        const { domain, slug } = ctx.params;

        if (slug) {
          return this.broker.call('dbPublishedPage.getPublishedPageBySlug', { domain, slug })
            .then((res) => ((res.ok) ? res.data.html : res))
            .catch((err) => {
              this.logger.error('ERROR: ', err);
              return { ok: false, error: err };
            });
        }

        return this.broker.call('dbDomainSettings.getDomainSettings', { domain })
          .then((domainSettings) => {
            const { webPageId } = domainSettings;
            return this.broker.call('dbPublishedPage.getPublishedPageByWebPageId', { webPageId });
          })
          .then((res) => ((res.ok) ? res.data.html : res))
          .catch((err) => {
            this.logger.error('ERROR: ', err);
            return { ok: false, error: err };
          });
      },
    },

    getAllPublishedPages: {
      handler() {
        return this.broker.call('dbPublishedPage.getAllPublishedPages')
          .catch((err) => {
            this.logger.error('ERROR: ', err);
            return { ok: false, error: err };
          });
      },
    },

    isPublished: {
      params: {
        webPageId: 'number',
      },
      handler(ctx) {
        const { webPageId } = ctx.params;

        return this.broker.call('dbPublishedPage.getPublishedPageByWebPageId', { webPageId })
          .then((res) => ({ ok: res.ok }))
          .catch((err) => {
            this.logger.error('ERROR: ', err);
            return { ok: false, error: err };
          });
      }
    },
  }
});
