module.exports = ({
  name: 'domainSettings',
  actions: {
    getHomePageId: {
      handler() {
        return this.broker.call('dbDomainSettings.getHomePageId', { domain: 'localhost:3011' });
      },
    },

    getDomains: {
      handler() {
        return this.broker.call('dbDomainSettings.getDomains');
      },
    },
  }
});
