module.exports = ({
  name: 'domainSettings',
  actions: {
    setDomainSettings: {
      handler(ctx) {
        const { id, ...rest } = ctx.params;

        return this.broker.call('dbDomainSettings.setDomainSettings', { id: +id, ...rest })
          .then((res) => JSON.stringify(res, null, 2))
          .catch((err) => {
            this.logger.error('ERROR SET DOMAIN SETTINGS: ', err);
            return { ok: false, error: err };
          });
      },
    },

    getDomainSettings: {
      params: {
        domainId: 'number',
      },
      async handler(ctx) {
        const { domainId } = ctx.params;
        const settings = await this.getDomainData(domainId);
        const aliases = await this.getDomainAliases(domainId);

        return { settings, aliases };
      },
    },

    getHomePageId: {
      params: {
        domain: 'string',
      },
      handler(ctx) {
        const { domain } = ctx.params;

        return this.broker.call('dbDomainSettings.getDomainSettingsByDomainName', { domain })
          .then(({ domainSettings }) => domainSettings.homePageId);
      },
    },

    formEditDomainSettings: {
      params: {
        id: 'string',
      },
      async handler(ctx) {
        const domainId = +ctx.params.id;
        const data = await this.getDomainData(domainId);
        const aliases = await this.getDomainAliases(domainId);
        const schema = await this.getDomainSettingsSchema(data.domain);

        const fields = schema.map((field) => ({
          ...field,
          value: data[field.name]
        }));

        const domainData = {
          data,
          fields,
          aliases,
        };

        return JSON.stringify({ ok: true, domainData }, null, 2);
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

        return this.broker.call('dbDomainSettings.getDomainSettingsByDomainName', { domain })
          .then(({ domainSettings }) => {
            if (domainSettings && domainSettings.homePageId === webPageId) {
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

  methods: {
    getDomainData: {
      handler(domainId) {
        return this.broker.call('dbDomainSettings.getDomainSettingsByDomainId', { domainId })
          .then(({ domainSettings }) => domainSettings);
      },
    },

    getDomainAliases: {
      handler(domainId) {
        return this.broker.call('dbAliases.getDomainAliases', { domainId })
          .then(({ aliases }) => aliases);
      },
    },

    getDomainSettingsSchema: {
      handler(domain) {
        return this.broker.call('schemas.getDomainSettingsSchema', { domain })
          .then(({ schema }) => schema);
      },
    },
  },
});
