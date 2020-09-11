const moment = require('moment');

module.exports = ({
  name: 'publish',
  actions: {

    createPublishedPage: {
      params: {
        webPageId: 'number',
        domainId: 'number',
        domain: 'string',
        slug: 'string',
        html: 'string',
      },
      handler(ctx) {
        const {
          webPageId, domainId, domain, slug, html
        } = ctx.params;

        return this.broker.call('dbPublishedPage.createPublishedPage', {
          webPageId, domainId, domain, slug, html
        })
          .catch((err) => {
            this.logger.error('ERROR: ', err);
            return { ok: false, error: err };
          });
      },
    },

    updatePublishedPage: {
      params: {
        webPageId: 'number',
        domainId: 'number',
        domain: 'string',
        slug: 'string',
        html: 'string',
      },
      handler(ctx) {
        const {
          webPageId, domainId, domain, slug, html
        } = ctx.params;

        return this.broker.call('dbPublishedPage.updatePublishedPage', {
          webPageId, domainId, domain, slug, html
        })
          .catch((err) => {
            this.logger.error('ERROR: ', err);
            return { ok: false, error: err };
          });
      },
    },

    destroyPublishedPage: {
      params: {
        webPageId: 'number',
      },
      handler(ctx) {
        const { webPageId } = ctx.params;

        return this.broker.call('dbPublishedPage.destroyPublishedPage', { webPageId })
          .catch((err) => {
            this.logger.error('ERROR: ', err);
            return { ok: false, error: err };
          });
      }
    },

    getPublishedPageByWebPageId: {
      params: {
        webPageId: 'number',
      },
      handler(ctx) {
        const { webPageId } = ctx.params;

        return this.broker.call('dbPublishedPage.getPublishedPageByWebPageId', { webPageId })
          .catch((err) => {
            this.logger.error('ERROR: ', err);
            return { ok: false, error: err };
          });
      },
    },

    getPageHTML: {
      handler(ctx) {
        const { domain, slug } = ctx.params;

        if (slug) {
          return this.broker.call('publish.getPublishedPageHTML', { domain, slug });
        }

        return this.broker.call('publish.getPublishedHomePageHTML', { domain });
      }
    },

    getPublishedPageHTML: {
      params: {
        domain: 'string',
      },
      handler(ctx) {
        const { domain, slug } = ctx.params;

        if (slug) {
          return this.broker.call('dbPublishedPage.getPublishedPageBySlug', { domain, slug })
            .then((res) => ((res.ok) ? res.data.html : ''))
            .catch((err) => {
              this.logger.error('ERROR: ', err);
              return { ok: false, error: err };
            });
        }

        return this.broker.call('dbDomainSettings.getDomainSettingsByDomainName', { domain })
          .then(({ domainSettings }) => {
            const { homePageId } = domainSettings;
            return this.broker.call('dbPublishedPage.getPublishedPageByWebPageId', { webPageId: homePageId });
          })
          .then((res) => ((res.ok) ? res.data.html : ''))
          .catch((err) => {
            this.logger.error('ERROR: ', err);
            return { ok: false, error: err };
          });
      },
    },

    listPublishedPages: {
      handler(ctx) {
        const { domain } = ctx.params;

        return this.broker.call('dbPublishedPage.listPublishedPages', { domain })
          .catch((err) => {
            this.logger.error('ERROR: ', err);
            return { ok: false, error: err };
          });
      },
    },

    isPublished: {
      params: {
        webPageId: 'number',
      },
      handler(ctx) {
        const { webPageId } = ctx.params;

        return this.broker.call('dbPublishedPage.getPublishedPageByWebPageId', { webPageId })
          .then((res) => ({ ok: res.ok }))
          .catch((err) => {
            this.logger.error('ERROR: ', err);
            return { ok: false, error: err };
          });
      }
    },

    checkRedirect: {
      handler(ctx) {
        const { domain, slug } = ctx.params;

        return this.broker.call('dbRedirects.getWebPageRedirectsBySlug', { domain, slug })
          .then((response) => {
            if (response && response.ok) {
              return this.broker.call('dbWebPages.getWebPageById', { id: response.redirect.dataValues.webPageId });
            }
          })
          .then((webPage) => {
            if (webPage) {
              return { ok: true, slug: webPage.data.slug };
            }
            return { ok: false };
          })
          .catch((err) => {
            this.logger.error('ERROR: ', err);
            return { ok: false, error: err };
          });
      },
    },

    checkAlias: {
      handler(ctx) {
        const { domain } = ctx.params;

        return this.broker.call('dbAliases.getMainDomainId', { domainAlias: domain })
          .then((response) => {
            if (response && response.ok) {
              return this.broker.call('dbDomainSettings.getDomainSettingsByDomainId', {
                domainId: response.domainId,
              });
            }
          })
          .then((response) => {
            if (response && response.ok) {
              return { ok: true, domain: response.domainSettings.domain };
            }
            return { ok: false };
          })
          .catch((err) => {
            this.logger.error('ERROR: ', err);
            return { ok: false, error: err };
          });
      },
    },

    generateSiteMap: {
      async handler(ctx) {
        const { domain } = ctx.params;

        const homePageId = await this.broker.call('dbDomainSettings.getDomainSettingsByDomainName', { domain })
          .then(({ domainSettings }) => domainSettings.homePageId);
        const disableIndexingWebPageIds = await this.broker.call('dbWebPages.listWebPages')
          .then((pages) => pages.filter((page) => page.disableIndexing))
          .then((pages) => pages.map((page) => (page.id)));

        const publishedPages = await this.broker.call('dbPublishedPage.listPublishedPages', { domain });
        const indexingPages = publishedPages.filter((page) => (
          !disableIndexingWebPageIds.includes(page.webPageId)
        ));

        const urls = indexingPages.sort((a, b) => b.publishedAt - a.publishedAt)
          .map((page) => {
            const url = (page.id === homePageId)
              ? `http://${domain}`
              : `http://${domain}/${page.slug}`;

            return (`
              <url>
                <loc>${url}</loc>
                <lastmod>${moment(page.publishedAt).format('YYYY-MM-DD')}</lastmod>
                <changefreq>monthly</changefreq>
                <priority>0.8</priority>
              </url>
            `);
          }).join('');

        const xml = `<?xml version="1.0" encoding="UTF-8"?>
          <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
            ${urls}
          </urlset> 
        `;
        return xml;
      },
    },
  },
});
