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
        const { sectionId, fields } = ctx.params;
        const preparedFields = fields
          .filter((field) => field.value.trim())
          .map((field) => ({ ...field, sectionId: +sectionId }));

        const fieldsForDelete = fields
          .filter((field) => field.id && !field.value.trim())
          .map((field) => field.id);

        return this.broker.call('dbFields.deleteFields', { fieldIds: fieldsForDelete })
          .then(() => this.broker.call('dbFields.createFields', { fields: preparedFields }))
          .then(() => JSON.stringify({ ok: true }))
          .catch((error) => {
            this.logger.error('ERROR SECTION WITH FIELDS UPDATE: ', error);
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
          .then((sectionsData) => sectionsData.map(({ id, order, schemaId }) => (
            { id, order, schemaId }
          )));
      },
    },

    getAllSections: {
      handler() {
        return this.broker.call('dbSections.getAllSections')
          .then((res) => JSON.stringify(res, null, 2));
      },
    },
  },
});
