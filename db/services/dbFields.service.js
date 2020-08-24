const { Op } = require('sequelize');
const db = require('../models');
const Rest = require('../mixins/rest');

module.exports = {
  name: 'dbFields',
  mixins: [Rest],
  settings: {
    model: db.Field,
  },
  actions: {

    createFields: {
      handler(ctx) {
        const { fields } = ctx.params;

        return this.settings.model.bulkCreate(fields, { updateOnDuplicate: ['value', 'updatedAt'] })
          .then(() => ({ ok: true }))
          .catch((error) => {
            this.logger.error('ERROR FIELDS UPDATE: ', error);
            return { ok: false, error };
          });
      },
    },

    bulkCreateFields: {
      handler(ctx) {
        const { fields } = ctx.params;

        return this.settings.model.bulkCreate(fields)
          .then((response) => response.map((item) => ({ ...item.dataValues })))
          .catch((error) => {
            this.logger.error('ERROR BULK CREATE FIELDS: ', error);

            return { ok: false, error };
          });
      },
    },

    deleteFields: {
      handler(ctx) {
        const { fieldIds } = ctx.params;

        return this.settings.model.destroy({ where: { id: fieldIds } })
          .then(() => ({ ok: true }))
          .catch((error) => {
            this.logger.error('ERROR FIELDS DELETE: ', error);
            return { ok: false, error };
          });
      },
    },

    getFieldsBySectionId: {
      handler(ctx) {
        const { sectionIds } = ctx.params;

        return this.settings.model.findAll({
          where: {
            sectionId: {
              [Op.or]: sectionIds,
            },
          },
        })
          .then((res) => res.map(({
            id, sectionId, type, order, name, label, value
          }) => ({
            id, sectionId, type, order, name, label, value
          })))
          .then((fields) => ({ ok: true, fields }))
          .catch((error) => ({ ok: false, error }));
      },
    },
  },
};
