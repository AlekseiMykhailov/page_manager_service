const { v4 } = require('uuid');

module.exports = ({
  name: 'webPages',
  actions: {

    createWebPage: {
      params: {
        domain: 'string',
        slug: 'string',
        title: 'string',
        description: 'string',
      },
      handler(ctx) {
        const {
          domainId, domain, slug, title, description
        } = ctx.params;

        return this.broker.call('dbRedirects.checkSlug', { domainId, slug })
          .then((response) => {
            if (response.ok) {
              return { ok: false };
            }

            return this.broker.call('dbWebPages.createWebPage', {
              domainId: +domainId, domain, slug, title, description
            });
          })
          .then(({ id }) => ({ ok: true, id }))
          .catch((error) => {
            this.logger.error('ERROR webPages.createWebPage: ', error);
            return JSON.stringify(error, null, 2);
          });
      },
    },

    updateWebPage: {
      params: {
        slug: 'string',
        title: 'string',
        description: 'string',
      },
      handler(ctx) {
        const {
          domainId, id, slug, title, description
        } = ctx.params;

        return this.broker.call('dbRedirects.checkSlug', { domainId, slug })
          .then((response) => {
            if (response.ok) {
              throw new Error({ ok: false });
            }

            return { ok: true };
          })
          .then(async () => {
            const { data } = await this.broker.call('dbWebPages.getWebPageById', { id: +id });
            const oldSlug = data.slug;
            if (slug !== oldSlug) {
              return this.broker.call('dbRedirects.addWebPageRedirect', {
                domainId,
                webPageId: +id,
                slug: oldSlug,
              });
            }
          })
          .then(() => this.broker.call('dbWebPages.updateWebPage', {
            id, slug, title, description
          }))
          .catch((err) => {
            this.logger.error('ERROR: ', err);
            return JSON.stringify(err, null, 2);
          });
      },
    },

    deleteWebPage: {
      params: {
        id: 'string',
      },
      handler(ctx) {
        const { id } = ctx.params;

        return this.broker.call('publish.isPublished', { webPageId: +id })
          .then((res) => {
            if (res.ok) {
              return { ok: false, error: 'Published Page could not be deleted' };
            }
            return this.broker.call('dbWebPages.deleteWebPage', { id: +id });
          })
          .then((res) => JSON.stringify(res, null, 2))
          .catch((err) => {
            this.logger.error('ERROR: ', err);
            return JSON.stringify(err, null, 2);
          });
      },
    },

    getWebPageById: {
      params: {
        id: 'number',
      },
      handler(ctx) {
        const { id } = ctx.params;

        return this.broker.call('dbWebPages.getWebPageById', { id })
          .catch((err) => {
            this.logger.error('ERROR: ', err);
            return JSON.stringify(err, null, 2);
          });
      },
    },

    previewWebPage: {
      params: {
        pageId: 'string',
      },
      handler(ctx) {
        const { pageId } = ctx.params;
        let webPage;

        return this.broker.call('dbWebPages.getWebPageById', { id: +pageId })
          .then((res) => {
            webPage = res.data;

            return this.broker.call('sections.getSectionsForWebPage', { webPageId: webPage.id });
          })
          .then((sections) => this.broker.call('builder.createWebPageHTML', { webPage, sections }))
          .catch((err) => {
            this.logger.error('ERROR: ', err);
            return JSON.stringify(err, null, 2);
          });
      },
    },

    getPreviewWebPageHTML: {
      params: {
        slug: 'string',
      },
      handler(ctx) {
        const { slug } = ctx.params;

        return this.broker.call('dbWebPages.previewWebPage', { slug })
          .then((res) => res.html);
      },
    },

    getListWebPages: {
      handler() {
        return this.broker.call('dbWebPages.getAllWebPages')
          .then(({ pages }) => JSON.stringify({ ok: true, pages }, null, 2))
          .catch((err) => {
            this.logger.error('ERROR: ', err);
            return JSON.stringify(err, null, 2);
          });
      },
    },

    publishWebPage: {
      params: {
        webPageId: 'string',
      },
      handler(ctx) {
        const webPageId = Number(ctx.params.webPageId);
        let webPage;

        return this.broker.call('dbWebPages.getWebPageById', { id: webPageId })
          .then((res) => {
            webPage = res.data;
            return this.broker.call('sections.getSectionsForWebPage', { webPageId });
          })
          .then((sections) => this.broker.call('builder.createWebPageHTML', { webPage, sections }))
          .then((html) => this.broker.call('publish.createPublishedPage', {
            ...webPage,
            webPageId,
            html,
          }))
          .then((response) => JSON.stringify(response, null, 2))
          .catch((err) => {
            this.logger.error('ERROR: ', err);
            return JSON.stringify(err, null, 2);
          });
      }
    },

    updatePublishedWebPage: {
      handler(ctx) {
        const { webPageId } = ctx.params;
        let webPage;

        return this.broker.call('dbWebPages.getWebPageById', { id: +webPageId })
          .then((res) => { webPage = res.data; })
          .then(() => this.broker.call('sections.getSectionsForWebPage', { webPageId: +webPageId }))
          .then((sections) => this.broker.call('builder.createWebPageHTML', { webPage, sections }))
          .then((html) => this.broker.call('dbPublishedPage.updatePublishedPage', {
            webPageId: webPage.id,
            domain: webPage.domain,
            slug: webPage.slug,
            html,
          }))
          .then((response) => JSON.stringify(response, null, 2))
          .catch((err) => {
            this.logger.error('ERROR: ', err);
            return JSON.stringify(err, null, 2);
          });
      }
    },

    unPublishWebPage: {
      params: {
        id: 'string',
      },
      handler(ctx) {
        const { id } = ctx.params;

        return this.broker.call('publish.destroyPublishedPage', { webPageId: +id })
          .then((response) => JSON.stringify(response, null, 2))
          .catch((err) => {
            this.logger.error('ERROR: ', err);
            return JSON.stringify(err, null, 2);
          });
      },
    },

    getPublishedWebPage: {
      params: {
        id: 'string',
      },
      handler(ctx) {
        const { id } = ctx.params;

        return this.broker.call('publish.getPublishedPageByWebPageId', { webPageId: +id })
          .then((response) => JSON.stringify(response, null, 2))
          .catch((err) => {
            this.logger.error('ERROR: ', err);
            return JSON.stringify(err, null, 2);
          });
      },
    },

    listPublishedWebPages: {
      handler() {
        return this.broker.call('publish.getAllPublishedPages')
          .then((response) => JSON.stringify(response, null, 2))
          .catch((err) => {
            this.logger.error('ERROR: ', err);
            return JSON.stringify(err, null, 2);
          });
      },
    },

    editWebPage: {
      params: {
        id: { type: 'string' },
      },
      handler(ctx) {
        const { id } = ctx.params;
        const response = {};

        return this.broker.call('webPages.getWebPageById', { id: +id })
          .then((webPage) => { response.webPage = webPage.data; })
          .then(() => this.broker.call('dbDomainSettings.getDomainData', { domainId: response.webPage.domainId }))
          .then((domain) => { response.domain = domain.domainData; })
          .then(() => this.broker.call('sections.getSectionsForWebPage', { webPageId: response.webPage.id }))
          .then((sections) => {
            response.sections = sections;
            return sections.map((section) => section.id);
          })
          .then((sectionIds) => this.broker.call('dbFields.getFieldsBySectionId', { sectionIds }))
          .then(({ fields }) => response.sections.map((section) => ({
            ...section,
            fields: fields.filter((field) => field.sectionId === section.id),
          })))
          .then((sections) => { response.sections = sections; })
          .then(() => this.broker.call('dbRedirects.getWebPageRedirects', { webPageId: response.webPage.id }))
          .then(({ redirects }) => { response.redirects = redirects; })
          .then(() => JSON.stringify({ ok: true, ...response }, null, 2))
          .catch((err) => {
            this.logger.error('ERROR: ', err);
            return JSON.stringify(err, null, 2);
          });
      },
    },

    cloneWebPage: {
      handler(ctx) {
        const cloningWebPageId = +ctx.params.webPageId;
        const toDomainId = +ctx.params.domainId;
        const toDomain = ctx.params.domain;
        const cloneData = {};

        return this.broker.call('dbWebPages.getWebPageById', { id: cloningWebPageId })
          .then(async (response) => {
            const {
              title, slug, description, domainId
            } = response.data;
            const toSameDomain = (domainId === toDomainId);
            const number = await this.broker.call('dbWebPages.numberWebPagesWithSlug', { domainId, slug });

            cloneData.webPage = {
              title: (toSameDomain) ? `Copy ${number} of ${title}` : title,
              slug: (toSameDomain) ? `copy-${number}-of-${slug}` : slug,
              domainId: toDomainId,
              domain: toDomain,
              description,
            };
          })
          .then(() => this.broker.call('webPages.createWebPage', cloneData.webPage))
          .then((response) => {
            cloneData.webPageId = response.id;
          })
          .then(() => this.broker.call('sections.getSectionsForWebPage', { webPageId: cloningWebPageId }))
          .then((sections) => {
            cloneData.sections = sections.map(({ id, order, schemaId }) => ({
              donorSectionId: id,
              order,
              schemaId,
              webPageId: cloneData.webPageId,
            }));
          })
          .then(() => cloneData.sections.map(({ order, schemaId, webPageId }) => (
            { order, schemaId, webPageId }
          )))
          .then((sections) => this.broker.call('dbSections.bulkCreateSection', { sections }))
          .then((createdSections) => {
            cloneData.sections = cloneData.sections.map((section) => ({
              ...section,
              id: createdSections.find(({ order }) => order === section.order).id,
            }));
          })
          .then(() => cloneData.sections.map((section) => section.donorSectionId))
          .then((sectionIds) => this.broker.call('dbFields.getFieldsBySectionId', { sectionIds }))
          .then(({ fields }) => fields.map(({
            sectionId, name, label, type, order, value
          }) => {
            const newSection = cloneData.sections.find((section) => section.donorSectionId === sectionId);
            if (newSection) {
              return {
                sectionId: newSection.id,
                name,
                label,
                type,
                order,
                value,
              };
            }
          }))
          .then((fields) => this.broker.call('dbFields.bulkCreateFields', { fields }))
          .then(() => JSON.stringify({ ok: true, id: cloneData.webPageId }, null, 2))
          .catch((err) => {
            this.logger.error('ERROR: ', err);
            return JSON.stringify(err, null, 2);
          });
      }
    },

    addWebPageRedirect: {
      handler(ctx) {
        const { redirectData } = ctx.params;
        const { domainId, slug } = redirectData;

        return this.broker.call('dbWebPages.checkSlug', { domainId, slug })
          .then((response) => {
            if (response.ok) {
              return { ok: false };
            }
            return this.broker.call('dbRedirects.addWebPageRedirect', redirectData);
          })
          .then((response) => JSON.stringify(response, null, 2))
          .catch((err) => {
            this.logger.error('ERROR: ', err);
            return JSON.stringify(err, null, 2);
          });
      },
    },

    deleteWebPageRedirect: {
      handler(ctx) {
        const { redirectId } = ctx.params;

        return this.broker.call('dbRedirects.deleteWebPageRedirect', { id: +redirectId })
          .then((response) => JSON.stringify(response, null, 2))
          .catch((err) => {
            this.logger.error('ERROR: ', err);
            return JSON.stringify(err, null, 2);
          });
      },
    },
  },
});
