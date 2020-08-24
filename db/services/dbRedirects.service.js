const db = require('../models');
const Rest = require('../mixins/rest');

module.exports = {
  name: 'dbRedirects',
  mixins: [Rest],
  settings: {
    model: db.Redirect,
  },
  actions: {

    addWebPageRedirect: {
      params: {
        domainId: 'number',
        webPageId: 'number',
        slug: 'string',
      },
      handler(ctx) {
        const { domainId, webPageId, slug } = ctx.params;

        return this.settings.model.create({ domainId, webPageId, slug })
          .then(() => ({ ok: true }))
          .catch((err) => {
            this.logger.error('ERROR: ', err);
            return JSON.stringify(err, null, 2);
          });
      },
    },

    deleteWebPageRedirect: {
      params: {
        id: 'number',
      },
      handler(ctx) {
        const { id } = ctx.params;

        return this.settings.model.destroy({ where: { id } })
          .then(() => ({ ok: true }))
          .catch((err) => {
            this.logger.error('ERROR: ', err);
            return JSON.stringify(err, null, 2);
          });
      },
    },

    getWebPageRedirects: {
      params: {
        webPageId: 'number',
      },
      handler(ctx) {
        const { webPageId } = ctx.params;

        return this.settings.model.findAll({ where: { webPageId } })
          .then((res) => res.map(({ id, slug }) => ({ id, webPageId, slug })))
          .then((redirects) => ({ ok: true, redirects }))
          .catch((err) => {
            this.logger.error('ERROR: ', err);
            return JSON.stringify(err, null, 2);
          });
      },
    },

    getWebPageRedirectsBySlug: {
      params: {
        domain: 'string',
        slug: 'string',
      },
      handler(ctx) {
        const { domain, slug } = ctx.params;

        return this.broker.call('dbDomainSettings.getDomainDataByDomain', { domain })
          .then(({ domainData }) => this.settings.model.findOne({
            where: {
              domainId: domainData.id,
              slug,
            }
          }))
          .then((redirect) => {
            if (redirect) {
              return { ok: true, redirect };
            }
            return { ok: false };
          })
          .catch((err) => {
            this.logger.error('ERROR: ', err);
            return JSON.stringify(err, null, 2);
          });
      },
    },

    checkSlug: {
      params: {
        domainId: 'number',
        slug: 'string',
      },
      handler(ctx) {
        const { domainId, slug } = ctx.params;

        return this.settings.model.findOne({ where: { domainId, slug } })
          .then((response) => {
            if (response) {
              return { ok: true };
            }

            return { ok: false };
          })
          .catch((err) => {
            this.logger.error('ERROR: ', err);
            return JSON.stringify(err, null, 2);
          });
      },
    },
  },
};
