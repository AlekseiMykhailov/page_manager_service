module.exports = ({
  name: 'rows',
  actions: {
    createRow: {
      handler(ctx) {
        this.logger.info('CREATE ROW: ', ctx.params);

        const row = { ...ctx.params };
        return this.broker.call('dbRows.createRow', { row });
      },
    },

    updateRow: {
      params: {
        rowId: 'string',
        order: 'number',
      },
      handler(ctx) {
        const { fields } = ctx.params;

        fields.forEach((field) => {
          const { id, value } = field;
          this.broker.call('dbFields.updateField', { id, value });
        });

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
