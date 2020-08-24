const { ServiceBroker } = require('moleculer');
const ApiService = require('moleculer-web');

const broker = new ServiceBroker();

broker.createService(ApiService);

module.exports = {
  name: 'apiGatewaySecond',
  mixins: [ApiService],
  settings: {
    port: 5002,
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
          'GET /': function (req, res) {
            const domain = req.headers.host;

            return this.broker.call('publish.getPublishedPageHTML', { domain })
              .then((html) => res.end(html))
              .catch((error) => { this.logger.info('ERROR: ', error); });
          },

          'GET /:slug': async function (req, res) {
            const domain = req.headers.host;
            const { slug } = req.$params;
            const redirect = await this.broker.call('publish.checkRedirect', {
              domain,
              slug,
            });

            if (redirect.ok) {
              res.writeHead(301, { Location: redirect.slug });
              res.end();
            }

            return this.broker.call('publish.getPublishedPageHTML', { domain, slug })
              .then((response) => {
                if (typeof (response) === 'string') {
                  res.end(response);
                }
              })
              .catch((error) => { this.logger.info('ERROR SLUG: ', error); });
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
