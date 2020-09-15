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
        const { schema, webPageId, order } = ctx.params;

        return this.settings.model.create({ schema, webPageId, order })
          .then((res) => ({ ok: true, sectionId: res.dataValues.id }))
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

    listSections: {
      handler() {
        return this.settings.model.findAll({ raw: true })
          .then((sections) => ({ ok: true, sections }))
          .catch((error) => {
            this.logger.error('ERROR listSections: ', error);
            return { ok: false, error };
          });
      },
    },
  },
};
