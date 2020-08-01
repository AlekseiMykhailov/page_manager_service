// DB Rest Mixin

module.exports = {
  actions: {
    create(ctx) {
      const { params } = ctx;
      const item = this.settings.model.create(params);
      return Promise.resolve(item);
    },

    get(ctx) {
      let options = {};
      const { params } = ctx;

      if (typeof ctx.params._opt !== 'undefined') {
        options = params._opt;
        delete params._opt;
      }

      options.where = params;

      return this.settings.model.findOne(options);
    },

    list(ctx) {
      let options = {};
      const { params } = ctx;

      if (typeof ctx.params._opt !== 'undefined') {
        options = params._opt;
        delete params._opt;
      }

      options.where = params;

      return this.settings.model.findAll(options);
    },

    async update(ctx) {
      const { id } = ctx.params;
      const { params } = ctx;
      delete params.id;

      return {
        success: await this.settings.model.update(params, {
          where: {
            id,
          }
        }) == 1
      };
    },

    async remove(ctx) {
      return {
        success: await this.settings.model.destroy({
          where: ctx.params,
        }) == 1
      };
    },
  }
};
