module.exports = ({
  name: 'instructors',
  actions: {
    createInstructor: {
      handler(ctx) {
        return this.broker.call('dbInstructors.createInstructor', { ...ctx.params })
          .then((res) => JSON.stringify(res, null, 2))
          .catch((err) => {
            this.logger.error('ERROR: ', err);
            return JSON.stringify(err, null, 2);
          });
      },
    },

    updateInstructor: {
      handler(ctx) {
        return this.broker.call('dbInstructors.updateInstructor', { ...ctx.params })
          .then((res) => JSON.stringify(res, null, 2))
          .catch((err) => {
            this.logger.error('ERROR: ', err);
            return JSON.stringify(err, null, 2);
          });
      },
    },

    deleteInstructor: {
      handler(ctx) {
        const id = +ctx.params.id;

        return this.broker.call('dbInstructors.deleteInstructor', { id })
          .then((res) => JSON.stringify(res, null, 2))
          .catch((err) => {
            this.logger.error('ERROR: ', err);
            return JSON.stringify(err, null, 2);
          });
      },
    },

    listInstructors: {
      handler() {
        return this.broker.call('dbInstructors.listInstructors')
          .then((res) => JSON.stringify(res, null, 2))
          .catch((err) => {
            this.logger.error('ERROR: ', err);
            return JSON.stringify(err, null, 2);
          });
      },
    },

    getInstructor: {
      handler(ctx) {
        const { id } = ctx.params;

        return id;
      },
    },

    formEditInstructor: {
      async handler(ctx) {
        const id = +ctx.params.id;
        const { schema } = await this.broker.call('schemas.getInstructorSchema');
        const { instructor } = await this.broker.call('dbInstructors.getInstructor', { id });

        const instructorFields = schema.map((field) => ({
          ...field,
          value: instructor[field.name]
        }));

        return JSON.stringify({ ok: true, instructorFields }, null, 2);
      },
    },

    listOptions: {
      handler() {
        return this.broker.call('dbInstructors.listInstructors')
          .then(({ instructors }) => instructors);
      },
    },
  },
});
