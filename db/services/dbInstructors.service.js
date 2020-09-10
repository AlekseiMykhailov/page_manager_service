const db = require('../models');
const Rest = require('../mixins/rest');

module.exports = {
  name: 'dbInstructors',
  mixins: [Rest],
  settings: {
    model: db.Instructor,
  },
  actions: {
    createInstructor: {
      handler(ctx) {
        const {
          name, photo, about, linkedIn, facebook, email
        } = ctx.params;

        return this.settings.model.create({
          name, photo, about, linkedIn, facebook, email
        })
          .then(({ dataValues }) => ({ ok: true, id: dataValues.id }))
          .catch((error) => {
            this.logger.error('ERROR CREATE INSTRUCTOR: ', error);
            return { ok: false, error };
          });
      },
    },
    updateInstructor: {
      handler(ctx) {
        const {
          id, name, photo, about, linkedIn, facebook, email
        } = ctx.params;

        return this.settings.model.update({
          name, photo, about, linkedIn, facebook, email
        }, {
          where: { id }
        })
          .then(() => ({ ok: true }))
          .catch((error) => {
            this.logger.error('ERROR UPDATE INSTRUCTOR: ', error);
            return { ok: false, error };
          });
      },
    },
    deleteInstructor: {
      handler(ctx) {
        const { id } = ctx.params;

        return this.settings.model.destroy({
          where: { id },
        })
          .then(() => ({ ok: true }))
          .catch((error) => {
            this.logger.error('ERROR DELETE INSTRUCTOR: ', error);
            return { ok: false, error };
          });
      },
    },

    listInstructors: {
      handler() {
        return this.settings.model.findAll({ raw: true })
          .then((instructors) => instructors.map(({
            id, name, photo, about, linkedIn, facebook, email
          }) => ({
            id, name, photo, about, linkedIn, facebook, email
          })))
          .then((instructors) => ({ ok: true, instructors }))
          .catch((error) => ({ ok: false, error }));
      },
    },

    getInstructor: {
      handler(ctx) {
        const { id } = ctx.params;

        return this.settings.model.findOne({ where: { id } })
          .then(({ dataValues }) => {
            const {
              name, photo, about, linkedIn, facebook, email
            } = dataValues;

            return {
              ok: true,
              instructor: {
                name, photo, about, linkedIn, facebook, email
              }
            };
          });
      },
    },
  },
};
