/* eslint-disable no-restricted-syntax */
module.exports = ({
  name: 'sections',
  actions: {
    createSection: {
      handler(ctx) {
        const {
          schema, webPageId, order, fields, fieldsets
        } = ctx.params;
        const fieldsetsFields = fieldsets.map((fieldset) => (fieldset.itemFields)).flat(Infinity);

        return this.broker.call('dbSections.createSection', { schema, webPageId, order })
          .then(({ sectionId }) => {
            const preparedFields = [...fields, ...fieldsetsFields].map((field) => ({
              ...field,
              sectionId,
            }));

            return this.broker.call('dbFields.createFields', { fields: preparedFields });
          })
          .catch((error) => {
            this.logger.error('ERROR SECTION CREATE: ', error);
            return { ok: false, error };
          });
      },
    },

    updateSectionFields: {
      params: {
        sectionId: 'string',
      },
      handler(ctx) {
        const { sectionId, fields, deletingFieldIds } = ctx.params;
        const preparedFields = fields.map((field) => ({ ...field, sectionId: +sectionId }));

        return this.broker.call('dbFields.createFields', { fields: preparedFields })
          .then(() => this.broker.call('dbFields.bulkDeleteFields', { fieldIds: deletingFieldIds }))
          .then(() => JSON.stringify({ ok: true }))
          .catch((error) => {
            this.logger.error('ERROR SECTION WITH FIELDS UPDATE: ', error);
            return { ok: false, error };
          });
      },
    },

    deleteSectionFields: {
      handler(ctx) {
        const { fieldIds } = ctx.params;

        return this.broker.call('dbFields.bulkDeleteFields', { fieldIds })
          .then(() => JSON.stringify({ ok: true }))
          .catch((error) => {
            this.logger.error('ERROR SECTION FIELDS DELETE: ', error);
            return { ok: false, error };
          });
      },
    },

    updateSectionOrder: {
      params: {
        sectionId: 'string',
        order: 'number',
      },
      handler(ctx) {
        const { sectionId, order } = ctx.params;

        return this.broker.call('dbSections.updateSection', { sectionId, order });
      },
    },

    deleteSection: {
      params: { id: 'string' },
      handler(ctx) {
        const { id } = ctx.params;

        return this.broker.call('dbSections.deleteSection', { id })
          .then((res) => JSON.stringify(res));
      },
    },

    getSectionsForWebPage: {
      params: {
        webPageId: 'number',
      },
      handler(ctx) {
        const { webPageId } = ctx.params;

        return this.broker.call('dbSections.getSectionsByWebPageId', { webPageId })
          .then((sectionsData) => sectionsData.map(({ id, order, schema }) => (
            { id, order, schema }
          )));
      },
    },

    listSections: {
      handler() {
        return this.broker.call('sections.listSections')
          .then((res) => JSON.stringify(res, null, 2));
      },
    },
  },
});
