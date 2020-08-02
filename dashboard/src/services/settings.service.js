module.exports = ({
  name: 'settings',
  actions: {
    getHomePageId() {
      return this.broker.call('dbSettings.getHomePageId', { domain: 'localhost:3011' });
    },
  }
});
