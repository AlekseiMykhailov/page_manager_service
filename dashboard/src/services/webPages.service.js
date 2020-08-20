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

        return this.broker.call('dbWebPages.createWebPage', {
          domainId: +domainId, domain, slug, title, description
        })
          .then((res) => {
            if (!res.ok) {
              throw new Error(res.error);
            } else {
              return res;
            }
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
        isHomePage: 'boolean',
        description: 'string',
      },
      handler(ctx) {
        const {
          id, slug, title, description
        } = ctx.params;

        return this.broker.call('dbWebPages.updateWebPage', {
          id, slug, title, description
        })
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

    // getWebPageByURL: {
    //   params: {
    //     domain: 'string',
    //     slug: 'string',
    //   },
    //   handler(ctx) {
    //     const { domain, slug } = ctx.params;

    //     return this.broker.call('dbWebPages.getWebPageByURL', { domain, slug })
    //       .catch((err) => {
    //         this.logger.error('ERROR: ', err);
    //         return JSON.stringify(err, null, 2);
    //       });
    //   },
    // },

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

            return this.broker.call('rows.getRowsForWebPage', { webPageId: webPage.id });
          })
          .then((rows) => this.broker.call('builder.createWebPageHTML', { webPage, rows }))
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
          .then((res) => res.pages)
          .then((pages) => ({ ok: true, pages }))
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
            return this.broker.call('rows.getRowsForWebPage', { webPageId });
          })
          .then((rows) => this.broker.call('builder.createWebPageHTML', { webPage, rows }))
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
          .then(() => this.broker.call('rows.getRowsForWebPage', { webPageId: +webPageId }))
          .then((rows) => this.broker.call('builder.createWebPageHTML', { webPage, rows }))
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

    getPublishedPageData: {
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

    getAllPublishedPagesData: {
      handler() {
        return this.broker.call('publish.getAllPublishedPages')
          .then((response) => JSON.stringify(response, null, 2))
          .catch((err) => {
            this.logger.error('ERROR: ', err);
            return JSON.stringify(err, null, 2);
          });
      }
    },

    cloneWebPage: {
      handler(ctx) {
        const cloningWebPageId = +ctx.params.webPageId;
        const toDomainId = +ctx.params.domainId;
        const toDomain = ctx.params.domain;
        const cloneData = {};

        return this.broker.call('dbWebPages.getWebPageById', { id: cloningWebPageId })
          .then((response) => {
            const {
              title, slug, description, domainId
            } = response.data;
            cloneData.webPage = {
              title: (domainId === toDomainId) ? `${title}-copy` : title,
              description,
              slug: (domainId === toDomainId) ? `${slug}-copy` : slug,
              domainId: toDomainId,
              domain: toDomain,
            };
          })
          .then(() => this.broker.call('dbWebPages.checkWebPageBySlug', {
            domain: cloneData.webPage.domain,
            slug: cloneData.webPage.slug,
          }))
          .then((res) => {
            if (res.ok) {
              cloneData.webPage.slug += `-${v4()}`;
            }
          })
          .then(() => this.broker.call('webPages.createWebPage', cloneData.webPage))
          .then((response) => {
            cloneData.webPageId = response.id;
          })
          .then(() => this.broker.call('rows.getRowsForWebPage', { webPageId: cloningWebPageId }))
          .then((rows) => {
            cloneData.rows = rows.map(({ id, order, schemaId }) => ({
              donorRowId: id,
              order,
              schemaId,
              webPageId: cloneData.webPageId,
            }));
          })
          .then(() => cloneData.rows.map(({ order, schemaId, webPageId }) => (
            { order, schemaId, webPageId }
          )))
          .then((rows) => this.broker.call('dbRows.bulkCreateRows', { rows }))
          .then((createdRows) => {
            cloneData.rows = cloneData.rows.map((row) => ({
              ...row,
              id: createdRows.find(({ order }) => order === row.order).id,
            }));
          })
          .then(() => cloneData.rows.map((row) => row.donorRowId))
          .then((rowIds) => this.broker.call('dbFields.getFieldsByRowId', { rowIds }))
          .then(({ fields }) => fields.map(({
            rowId, name, label, type, order, value
          }) => ({
            rowId: cloneData.rows.find((row) => row.donorRowId === rowId).id,
            name,
            label,
            type,
            order,
            value,
          })))
          .then((fields) => this.broker.call('dbFields.bulkCreateFields', { fields }))
          .then(() => JSON.stringify({ ok: true, id: cloneData.webPageId }, null, 2))
          .catch((err) => {
            this.logger.error('ERROR: ', err);
            return JSON.stringify(err, null, 2);
          });
      }
    },
  },
});
