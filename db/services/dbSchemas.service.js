const db = require('../models');
const Rest = require('../mixins/rest');

module.exports = {
  name: 'dbSchemas',
  mixins: [Rest],
  settings: {
    model: db.Schema,
  },
  actions: {
    createSchema: {
      handler(ctx) {
        const { name, type, json } = ctx.params;

        return this.settings.model.create({ name, type, json })
          .then(() => ({ ok: true }))
          .catch((error) => {
            this.logger.error('ERROR createSchema: ', error);
            return { ok: false, error };
          });
      },
    },

    editSchema: {
      handler(ctx) {
        const {
          id, name, type, json
        } = ctx.params;

        return this.settings.model.update(
          { name, type, json },
          { where: { id } },
        )
          .then(() => ({ ok: true }))
          .catch((error) => {
            this.logger.error('ERROR createSchema: ', error);
            return { ok: false, error };
          });
      },
    },

    listSchemas: {
      handler() {
        return this.settings.model.findAll({ raw: true })
          .then((schemas) => ({ ok: true, schemas }))
          .catch((error) => {
            this.logger.error('ERROR listSchemas: ', error);
            return { ok: false, error };
          });
      },
    },
  },
};
