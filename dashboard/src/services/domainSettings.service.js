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
        domain: 'string',
      },
      handler(ctx) {
        const { domain } = ctx.params;

        return this.broker.call('dbDomainSettings.getDomainSettings', { domain })
          .then((res) => JSON.stringify(res, null, 2));
      },
    },

    getDomains: {
      handler() {
        return this.broker.call('dbDomainSettings.getDomains')
          .then((res) => JSON.stringify(res, null, 2));
      },
    },
  }
});
