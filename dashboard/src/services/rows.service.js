/* eslint-disable no-restricted-syntax */
module.exports = ({
  name: 'rows',
  actions: {
    createRow: {
      handler(ctx) {
        const row = { ...ctx.params };
        return this.broker.call('dbRows.createRow', { row });
      },
    },

    updateRowFields: {
      params: {
        rowId: 'string',
      },
      handler(ctx) {
        const { rowId, fields } = ctx.params;
        const preparedFields = fields
          .filter((field) => field.value.trim())
          .map((field) => ({ ...field, rowId: +rowId }));

        const fieldsForDelete = fields
          .filter((field) => field.id && !field.value.trim())
          .map((field) => field.id);

        return this.broker.call('dbFields.deleteFields', { fieldIds: fieldsForDelete })
          .then(() => this.broker.call('dbFields.createFields', { fields: preparedFields }))
          .then(() => JSON.stringify({ ok: true }))
          .catch((error) => {
            this.logger.error('ERROR ROW WITH FIELDS UPDATE: ', error);

            return { ok: false, error };
          });
      },
    },

    updateRowOrder: {
      params: {
        rowId: 'string',
        order: 'number',
      },
      handler(ctx) {
        const { rowId, order } = ctx.params;

        return this.broker.call('dbRows.updateRow', { rowId, order });
      },
    },

    deleteRow: {
      params: { id: 'string' },
      handler(ctx) {
        const { id } = ctx.params;

        return this.broker.call('dbRows.deleteRow', { id })
          .then((res) => JSON.stringify(res));
      },
    },

    getRowsForWebPage: {
      params: {
        webPageId: 'number',
      },
      handler(ctx) {
        const { webPageId } = ctx.params;

        return this.broker.call('dbRows.getRowsByWebPageId', { webPageId })
          .then((rowsData) => rowsData.map(({ id, order, schemaId }) => ({ id, order, schemaId })));
      },
    },

    getAllRows: {
      handler() {
        return this.broker.call('dbRows.getAllRows')
          .then((res) => JSON.stringify(res, null, 2));
      },
    },
  },
});
