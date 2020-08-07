const db = require('../models');
const Rest = require('../mixins/rest');

module.exports = {
  name: 'dbRows',
  mixins: [Rest],
  settings: {
    model: db.Row,
  },
  actions: {

    createRow: {
      params: {},
      handler(ctx) {
        const { row } = ctx.params;
        const {
          schemaId, webPageId, order, fields
        } = row;

        return this.settings.model.create({ schemaId, webPageId, order })
          .then((res) => (res.dataValues.id))
          .then((rowId) => {
            fields.forEach((field) => {
              this.broker.call('dbFields.createField', { field: { ...field, rowId } });
            });

            return rowId;
          })
          .then((rowId) => ({ ok: true, rowId }))
          .catch((err) => ({ ok: false, err }));
      },
    },

    updateRow: {
      handler(ctx) {
        const { rowId, order } = ctx.params;

        return this.settings.model.update({ order }, {
          where: { id: rowId }
        })
          .then(() => ({ ok: true }))
          .catch((error) => ({ ok: false, error }));
      },
    },

    deleteRow: {
      handler(ctx) {
        const { id } = ctx.params;

        return this.settings.model.destroy({
          where: { id },
        })
          .then(() => ({ ok: true }))
          .catch((error) => ({ ok: false, error }));
      },
    },

    getRowsByWebPageId: {
      handler(ctx) {
        const { webPageId } = ctx.params;

        return this.settings.model.findAll({
          where: {
            webPageId,
          }
        });
      }
    },

    getAllRows() {
      return this.settings.model.findAll({ raw: true });
    },
  },
};
