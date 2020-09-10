const { ServiceBroker } = require('moleculer');
const ApiService = require('moleculer-web');

const broker = new ServiceBroker();

broker.createService(ApiService);

module.exports = {
  name: 'deliveryHTTP',
  mixins: [ApiService],
  settings: {
    port: 80,
    cors: {
      origin: ['*'],
      methods: ['GET'],
      allowedHeaders: ['Content-Type', 'Origin', 'User-Agent', 'method'],
      credentials: true,
      maxAge: 3600,
    },
    routes: [
      {
        path: '/',
        aliases: {
          'GET /': async function getIndexHTML(req, res) {
            const domain = req.headers.host;
            const alias = await this.broker.call('publish.checkAlias', { domain });

            if (alias.ok) {
              // TODO: separate writeHead and end into a method
              res.writeHead(301, { Location: `http://${alias.domain}` });
              res.end();

              return null;
            }

            return this.broker.call('publish.getPublishedPageHTML', { domain })
              .then((html) => res.end(html))
              .catch((error) => { this.logger.error('ERROR: ', error); });
          },

          'GET /:slug': async function getHTML(req, res) {
            const domain = req.headers.host;
            const { slug } = req.$params;
            const [alias, redirect, isHomePage] = await Promise.all([
              this.broker.call('publish.checkAlias', { domain }),
              this.broker.call('publish.checkRedirect', { domain, slug }),
              this.broker.call('domainSettings.isHomePage', { domain, slug }),
            ]);

            if (alias.ok) {
              res.writeHead(301, { Location: `http://${alias.domain}/${slug}` });
              res.end();

              return null;
            }

            if (redirect.ok) {
              res.writeHead(301, { Location: `http://${domain}/${redirect.slug}` });
              res.end();

              return null;
            }

            if (isHomePage.ok) {
              res.writeHead(301, { Location: `http://${domain}` });
              res.end();

              return null;
            }

            return this.broker.call('publish.getPublishedPageHTML', { domain, slug })
              .then((html) => res.end(html))
              .catch((error) => { this.logger.error('ERROR: ', error); });
          },

          'GET /robots.txt': async function getRobotsTXT(req, res) {
            const domain = req.headers.host;
            const alias = await this.broker.call('publish.checkAlias', { domain });

            if (alias.ok) {
              res.writeHead(301, { Location: `http://${alias.domain}/robots.txt` });
              res.end();
              return null;
            }

            return this.broker.call('dbDomainSettings.getDomainSettingsByDomainName', { domain })
              .then(({ domainSettings }) => res.end(domainSettings.robotsTxt));
          },

          'GET /sitemap.xml': async function getSitemapXML(req, res) {
            const domain = req.headers.host;
            const alias = await this.broker.call('publish.checkAlias', { domain });

            if (alias.ok) {
              res.writeHead(301, { Location: `http://${alias.domain}/sitemap.xml` });
              res.end();
              return null;
            }

            return this.broker.call('publish.generateSiteMap', { domain })
              .then((response) => res.end(response))
              .catch((error) => { this.logger.error('ERROR: ', error); });
          },
        },
        bodyParsers: {
          json: true,
        },
        onBeforeCall: async (ctx, route, req, res) => {
          ctx.meta.$responseType = 'text/html; charset=utf-8';
          ctx.meta.userAgent = req.headers['user-agent'];
        },
      },
    ],
  },
};
