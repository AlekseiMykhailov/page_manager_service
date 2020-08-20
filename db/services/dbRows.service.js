/* eslint-disable no-restricted-syntax */
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
        let rowId;

        return this.settings.model.create({ schemaId, webPageId, order })
          .then((res) => {
            rowId = res.dataValues.id;
            const preparedFields = fields.map((field) => ({ ...field, rowId }));

            return this.broker.call('dbFields.createFields', { fields: preparedFields });
          })
          .then(() => ({ ok: true, rowId }))
          .catch((error) => {
            this.logger.error('ERROR ROW WITH FIELDS CREATE: ', error);

            return { ok: false, error };
          });
      },
    },

    bulkCreateRows: {
      handler(ctx) {
        const { rows } = ctx.params;

        return this.settings.model.bulkCreate(rows)
          .then((response) => response.map((item) => ({ ...item.dataValues })))
          .catch((error) => {
            this.logger.error('ERROR BULK CREATE ROWS: ', error);

            return { ok: false, error };
          });
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
  },
};
