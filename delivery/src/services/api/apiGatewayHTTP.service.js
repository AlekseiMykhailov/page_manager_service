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
          'GET /': async function (req, res) {
            const domain = req.headers.host;
            const alias = await this.broker.call('publish.checkAlias', { domain });

            if (alias.ok) {
              res.writeHead(301, { Location: `http://${alias.domain}` });
              res.end();
            }

            return this.broker.call('publish.getPublishedPageHTML', { domain })
              .then((html) => res.end(html))
              .catch((error) => { this.logger.error('ERROR: ', error); });
          },

          'GET /:slug': async function (req, res) {
            const domain = req.headers.host;
            const { slug } = req.$params;
            const alias = await this.broker.call('publish.checkAlias', { domain });
            const redirect = await this.broker.call('publish.checkRedirect', { domain, slug });

            if (alias.ok) {
              res.writeHead(301, { Location: `http://${alias.domain}/${slug}` });
              res.end();
            } else if (redirect.ok) {
              res.writeHead(301, { Location: redirect.slug });
              res.end();
            }

            return this.broker.call('publish.getPublishedPageHTML', { domain, slug })
              .then((response) => {
                if (typeof (response) === 'string') {
                  res.end(response);
                }
              })
              .catch((error) => { this.logger.error('ERROR: ', error); });
          },
        },
        bodyParsers: {
          json: true,
        },
        onBeforeCall: (ctx, route, req, res) => {
          ctx.meta.$responseType = 'text/html; charset=utf-8';
          ctx.meta.userAgent = req.headers['user-agent'];
        },
      },
    ],
  },
};
