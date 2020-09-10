module.exports = ({
  name: 'webPages',
  actions: {

    createWebPage: {
      params: {
        fields: 'array',
      },
      async handler(ctx) {
        const { fields } = ctx.params;
        const pageData = fields.reduce((acc, field) => ({
          ...acc,
          [field.name]: field.value,
        }), {});
        const {
          domain, slug, title, description, disableIndexing
        } = pageData;
        const domainId = await this.broker.call('dbDomainSettings.getDomainDataByDomain', { domain: pageData.domain })
          .then((res) => res.domainData.id);

        return this.broker.call('dbRedirects.checkSlug', { domainId, slug })
          .then((response) => {
            if (response.ok) {
              return { ok: false };
            }

            return this.broker.call('dbWebPages.createWebPage', {
              domainId,
              domain,
              slug,
              title,
              description,
              disableIndexing,
            });
          })
          .then(({ id }) => ({ ok: true, domainId, webPageId: id }))
          .catch((error) => {
            this.logger.error('ERROR webPages.createWebPage: ', error);
            return JSON.stringify(error, null, 2);
          });
      },
    },

    updateWebPage: {
      params: {
        fields: 'array',
      },
      async handler(ctx) {
        const { id, fields } = ctx.params;
        const pageData = fields.reduce((acc, field) => ({
          ...acc,
          [field.name]: field.value,
        }), {});
        const {
          slug, title, description, disableIndexing
        } = pageData;
        const domainId = await this.broker.call('dbDomainSettings.getDomainDataByDomain', { domain: pageData.domain })
          .then((res) => res.domainData.id);

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
            return null;
          })
          .then(() => this.broker.call('dbWebPages.updateWebPage', {
            id: +id,
            slug,
            title,
            description,
            disableIndexing,
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
      async handler(ctx) {
        const id = +ctx.params.pageId;

        const { data, sections, fields } = await this.collectWebPageEntities(id);

        return this.broker.call('builder.createWebPageHTML', {
          webPage: data,
          sections,
          fields,
        })
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

    listWebPages: {
      async handler() {
        const listWebPages = await this.broker.call('dbWebPages.listWebPages');
        const listPublished = await this.broker.call('dbPublishedPage.listPublishedPages');
        const listDomains = await this.broker.call('dbDomainSettings.listDomains');

        const pages = listWebPages.map((page) => {
          const publishData = listPublished.find((published) => published.webPageId === page.id);
          const domainData = listDomains.find((domain) => domain.id === page.domainId);

          return {
            ...page,
            domain: domainData.domain,
            isHomePage: domainData.homePageId === page.id,
            publishedAt: publishData && publishData.publishedAt,
          };
        });

        return JSON.stringify({ ok: true, pages }, null, 2);
      },
    },

    publishWebPage: {
      params: {
        webPageId: 'string',
      },
      async handler(ctx) {
        const id = +ctx.params.webPageId;
        const { data, sections, fields } = await this.collectWebPageEntities(id);

        return this.broker.call('builder.createWebPageHTML', {
          webPage: data,
          sections,
          fields,
        })
          .then((html) => this.broker.call('publish.createPublishedPage', {
            ...data,
            webPageId: id,
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
      async handler(ctx) {
        const id = +ctx.params.webPageId;
        const { data, sections, fields } = await this.collectWebPageEntities(id);

        return this.broker.call('builder.createWebPageHTML', {
          webPage: data,
          sections,
          fields,
        })
          .then((html) => this.broker.call('dbPublishedPage.updatePublishedPage', {
            webPageId: id,
            domain: data.domain,
            slug: data.slug,
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

    formEditWebPage: {
      params: {
        id: { type: 'string' },
      },
      async handler(ctx) {
        const id = +ctx.params.id;

        const webPage = await this.broker.call('webPages.getWebPageById', { id }).then((res) => res.data);
        const [
          domainData,
          webPageRedirects,
          webPageSections,
          webPagePublishData,
          webPageSchema,
          sectionSchemas,
        ] = await Promise.all([
          this.broker.call('dbDomainSettings.getDomainData', { domainId: webPage.domainId }).then((res) => res.domainData),
          this.broker.call('dbRedirects.getWebPageRedirects', { webPageId: webPage.id }).then((res) => res.redirects),
          this.broker.call('sections.getSectionsForWebPage', { webPageId: webPage.id }),
          this.broker.call('dbPublishedPage.getPublishedPageByWebPageId', { webPageId: webPage.id }).then((res) => res.data),
          this.broker.call('schemas.getWebPageSchema').then((res) => res.schema),
          this.broker.call('schemas.listSectionSchemas').then((res) => res.schemas),
        ]);
        const webPageFields = await this.broker.call('dbFields.getFieldsBySectionId', {
          sectionIds: webPageSections.map((section) => section.id)
        }).then((res) => res.fields);
        const { domain, slug, title } = webPage;

        const preparedData = {
          id,
          domain,
          slug,
          title,
          isHomePage: domainData.homePageId === webPage.id,
          publishedAt: (webPagePublishData && webPagePublishData.publishedAt) || false,
          webPageFields: [
            ...webPageSchema.map((field) => ({
              ...field,
              value: webPage[field.name],
            })),
          ],
          redirects: webPageRedirects,
          sections: webPageSections.map((section) => {
            const sectionSchema = sectionSchemas.find((schema) => schema.name === section.schema);
            const sectionFields = webPageFields.filter((field) => field.sectionId === section.id);

            const preparedSection = {
              ...section,
              name: sectionSchema.name,
              title: sectionSchema.title,
              schema: sectionSchema,
              fields: webPageFields.filter((field) => (field.sectionId === section.id && !field.name.includes('.')))
                .map((field) => ({
                  ...sectionSchema.fields.find((fieldSchema) => fieldSchema.name === field.name),
                  ...field,
                })),
              fieldsets: sectionSchema.fieldsets.map((fieldset) => ({
                ...fieldset,
                fieldsBlocks: [],
              })),
            };

            sectionFields.forEach(async (fieldData) => {
              const fieldsBlockIndex = fieldData.name.replace(/\D/g, '');

              if (fieldsBlockIndex) {
                const fieldsetName = fieldData.name.split('[')[0];
                const targetFieldset = preparedSection.fieldsets.find((fieldset) => (
                  fieldset.name === fieldsetName
                ));

                const fieldSchema = targetFieldset.itemFields.find((itemFieldSchema) => (
                  itemFieldSchema.name === fieldData.name.replace(/\[\d+\]/g, '')
                ));

                const preparedField = { ...fieldSchema, ...fieldData };

                if (targetFieldset.fieldsBlocks[fieldsBlockIndex]) {
                  targetFieldset.fieldsBlocks[fieldsBlockIndex] = [
                    ...targetFieldset.fieldsBlocks[fieldsBlockIndex],
                    preparedField,
                  ];
                } else {
                  targetFieldset.fieldsBlocks[fieldsBlockIndex] = [preparedField];
                }
              }
            });

            preparedSection.fieldsets = preparedSection.fieldsets.map((fieldset) => ({
              ...fieldset,
              fieldsBlocks: fieldset.fieldsBlocks.filter(Boolean),
            }));

            return preparedSection;
          })
        };

        return JSON.stringify({ ok: true, data: preparedData }, null, 2);
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
            cloneData.sections = sections.map(({ id, order, schema }) => ({
              donorSectionId: id,
              order,
              schema,
              webPageId: cloneData.webPageId,
            }));
          })
          .then(() => cloneData.sections.map(({ order, schema, webPageId }) => (
            { order, schema, webPageId }
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
            const newSection = cloneData.sections.find((section) => (
              section.donorSectionId === sectionId
            ));
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
            return null;
          }))
          .then((fields) => {
            if (fields) {
              return this.broker.call('dbFields.bulkCreateFields', { fields });
            }
            return null;
          })
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

  methods: {
    collectWebPageEntities: {
      async handler(id) {
        const webPage = {};

        webPage.data = await this.broker.call('dbWebPages.getWebPageById', { id })
          .then(({ data }) => data);
        webPage.sections = await this.broker.call('sections.getSectionsForWebPage', { webPageId: id });
        const sectionIds = webPage.sections.map((section) => section.id);
        const webPageFields = await this.broker.call('dbFields.getFieldsBySectionId', { sectionIds })
          .then(({ fields }) => fields);
        webPage.fields = await this.prepareFields(webPageFields);

        return webPage;
      },
    },

    prepareFields: {
      async handler(fields) {
        const preparedFields = [];

        fields.forEach(async (field) => {
          if (field.name.includes('instructors')) {
            const instructorFields = await this.prepareInstructorsFields(field);
            preparedFields.push(...instructorFields);
          }
          preparedFields.push(field);
        });

        return preparedFields;
      },
    },

    prepareInstructorsFields: {
      async handler(field) {
        const instructorsList = await this.broker.call('dbInstructors.listInstructors')
          .then(({ instructors }) => instructors);
        const fieldsBlockIndex = field.name.replace(/\D/g, '');
        const instructorData = instructorsList.find((instructor) => (
          instructor.id === +field.value
        ));

        const instructorFields = Object.entries(instructorData).map((entry) => {
          if (entry[0] === 'id') {
            return null;
          }

          return {
            sectionId: field.sectionId,
            name: `instructors[${fieldsBlockIndex}].${entry[0]}`,
            value: entry[1],
          };
        }).filter(Boolean);

        return instructorFields;
      },
    },
  },
});
