const { ServiceBroker } = require('moleculer');
const ApiService = require('moleculer-web');

const broker = new ServiceBroker();

broker.createService(ApiService);

module.exports = {
  name: 'apiGateway',
  mixins: [ApiService],
  settings: {
    port: process.env.DELIVERY_PORT || 3011,
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
          'GET /': 'publish.getPublishedHomePageHTML',
          'GET /:slug': 'publish.getPublishedPageHTML',
        },
        bodyParsers: {
          json: true,
        },
        onBeforeCall: (ctx, route, req, res) => {
          ctx.meta.$responseType = 'text/html; charset=utf-8';
          ctx.meta.userAgent = req.headers['user-agent'];
        },
      },

      { // TODO: delete it after testing
        path: '/all',
        aliases: {
          'GET /': 'dbPublishedPage.getAllPublishedPages',
        },
        bodyParsers: {
          json: true,
        },
        onBeforeCall: (ctx, route, req, res) => {
          ctx.meta.$responseType = 'application/json; charset=utf-8';
          ctx.meta.userAgent = req.headers['user-agent'];
        },
      }
    ],
  },
};
