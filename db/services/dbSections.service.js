/* eslint-disable no-restricted-syntax */
const db = require('../models');
const Rest = require('../mixins/rest');

module.exports = {
  name: 'dbSections',
  mixins: [Rest],
  settings: {
    model: db.Section,
  },
  actions: {

    createSection: {
      params: {},
      handler(ctx) {
        const { section } = ctx.params;
        const {
          schemaId, webPageId, order, fields
        } = section;
        let sectionId;

        return this.settings.model.create({ schemaId, webPageId, order })
          .then((res) => {
            sectionId = res.dataValues.id;
            const preparedFields = fields.map((field) => ({ ...field, sectionId }));

            return this.broker.call('dbFields.createFields', { fields: preparedFields });
          })
          .then(() => ({ ok: true, sectionId }))
          .catch((error) => {
            this.logger.error('ERROR SECTION CREATE: ', error);
            return { ok: false, error };
          });
      },
    },

    bulkCreateSection: {
      handler(ctx) {
        const { sections } = ctx.params;

        return this.settings.model.bulkCreate(sections)
          .then((response) => response.map((item) => ({ ...item.dataValues })))
          .catch((error) => {
            this.logger.error('ERROR BULK CREATE SECTIONS: ', error);
            return { ok: false, error };
          });
      },
    },

    updateSection: {
      handler(ctx) {
        const { sectionId, order } = ctx.params;

        return this.settings.model.update({ order }, {
          where: { id: sectionId }
        })
          .then(() => ({ ok: true }))
          .catch((error) => {
            this.logger.error('ERROR UPDATE SECTIONS: ', error);
            return { ok: false, error };
          });
      },
    },

    deleteSection: {
      handler(ctx) {
        const { id } = ctx.params;

        return this.settings.model.destroy({
          where: { id },
        })
          .then(() => ({ ok: true }))
          .catch((error) => {
            this.logger.error('ERROR DELETE CREATE SECTIONS: ', error);
            return { ok: false, error };
          });
      },
    },

    getSectionsByWebPageId: {
      handler(ctx) {
        const { webPageId } = ctx.params;

        return this.settings.model.findAll({
          where: {
            webPageId,
          }
        })
          .catch((error) => {
            this.logger.error('ERROR getSectionsByWebPageId: ', error);
            return { ok: false, error };
          });
      }
    },
  },
};
