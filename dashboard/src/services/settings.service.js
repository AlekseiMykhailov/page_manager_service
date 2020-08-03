module.exports = ({
  name: 'settings',
  actions: {
    getHomePageId: {
      handler() {
        return this.broker.call('dbSettings.getHomePageId', { domain: 'localhost:3011' });
      },
    },
  }
});
