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
      async handler(ctx) {
        const { rowId, fields } = ctx.params;

        for await (const field of fields) {
          this.logger.info('@@@: ', field);

          const { id, value } = field;
          if (id && !value) {
            this.broker.call('dbFields.deleteField', { id });
          } else if (id) {
            this.broker.call('dbFields.updateField', { id, value });
          } else {
            this.broker.call('dbFields.createField', { field: { ...field, rowId: +rowId } });
          }
        }

        this.logger.info('-------------before return-------------');
        return JSON.stringify({ ok: true });
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
