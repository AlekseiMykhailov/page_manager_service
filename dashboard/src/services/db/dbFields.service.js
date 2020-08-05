const { Op } = require('sequelize');
const db = require('./models');
const Rest = require('./mixins/rest');

module.exports = {
  name: 'dbFields',
  mixins: [Rest],
  settings: {
    model: db.Field,
  },
  actions: {

    createField: {
      params: {},
      handler(ctx) {
        const { field } = ctx.params;

        return this.settings.model.create(field)
          .then((res) => ({ ok: true, id: res.dataValues.id }))
          .catch((err) => {
            this.logger.error('ERROR FIELD CREATE: ', err);

            return { ok: false, err };
          });
      },
    },

    updateField: {
      handler(ctx) {
        const { id, value} = ctx.params;

        return this.settings.model.update({ value }, {
          where: { id }
        })
          .then(() => ({ ok: true }))
          .catch((error) => ({ ok: false, error }));
      },
    },

    getFieldsByRowId: {
      handler(ctx) {
        const { rowIds } = ctx.params;

        return this.settings.model.findAll({
          where: {
            rowId: {
              [Op.or]: rowIds,
            },
          },
        })
          .then((res) => res.map(({
            id, rowId, type, name, value
          }) => ({
            id, rowId, type, name, value
          })))
          .then((fields) => ({ ok: true, fields }))
          .catch((err) => ({ ok: false, err }));
      },
    },

    getAllFields() {
      return this.settings.model.findAll({ raw: true });
    },
  },
};
