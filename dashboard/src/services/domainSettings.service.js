module.exports = ({
  name: 'domainSettings',
  actions: {
    setDomainSettings: {
      handler(ctx) {
        const { id, homePageId } = ctx.params;

        return this.broker.call('dbDomainSettings.setDomainSettings', { id, homePageId })
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

    getDomains: {
      handler() {
        return this.broker.call('dbDomainSettings.getDomains')
          .then((res) => JSON.stringify(res, null, 2));
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
