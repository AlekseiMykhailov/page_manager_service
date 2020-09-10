module.exports = ({
  name: 'domainSettings',
  actions: {
    setDomainSettings: {
      handler(ctx) {
        const { id, homePageId, robotsTxt } = ctx.params;

        return this.broker.call('dbDomainSettings.setDomainSettings', { id, homePageId, robotsTxt })
          .then((res) => JSON.stringify(res, null, 2));
      },
    },

    getDomainSettings: {
      params: {
        id: 'string',
      },
      handler(ctx) {
        const { id } = ctx.params;
        const domainData = {};

        return this.broker.call('dbDomainSettings.getDomainSettingsByDomainId', { id: +id })
          .then((response) => { domainData.settings = response.domainSettings; })
          .then(() => this.broker.call('dbAliases.getDomainAliases', { domainId: +id }))
          .then((response) => { domainData.aliases = response.aliases; })
          .then(() => JSON.stringify(domainData, null, 2))
          .catch((error) => {
            this.logger.error('ERROR: ', error);
          });
      },
    },

    listDomains: {
      handler() {
        return this.broker.call('dbDomainSettings.listDomains')
          .then((res) => JSON.stringify(res, null, 2));
      },
    },

    isHomePage: {
      params: {
        domain: 'string',
        slug: 'string',
      },
      async handler(ctx) {
        const { domain, slug } = ctx.params;
        const webPageId = await this.broker.call('dbWebPages.getWebPageBySlug', { domain, slug })
          .then(({ data }) => (data ? data.id : null));

        return this.broker.call('dbDomainSettings.getDomainDataByDomain', { domain })
          .then(({ domainData }) => {
            if (domainData && domainData.homePageId === webPageId) {
              return { ok: true };
            }
            return { ok: false };
          });
      },
    },

    addDomainAlias: {
      handler(ctx) {
        const { aliasData } = ctx.params;
        const { domainId, domainAlias } = aliasData;

        return this.broker.call('dbAliases.addDomainAlias', { domainId, domainAlias })
          .then((res) => JSON.stringify(res, null, 2))
          .catch((error) => {
            this.logger.error('ERROR: ', error);
          });
      },
    },

    deleteDomainAlias: {
      handler(ctx) {
        const { id } = ctx.params;

        return this.broker.call('dbAliases.deleteDomainAlias', { id: +id })
          .then((res) => JSON.stringify(res, null, 2))
          .catch((error) => {
            this.logger.error('ERROR: ', error);
          });
      },
    },
  },
});
