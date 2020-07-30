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
      methods: ['GET', 'OPTIONS', 'POST', 'PUT', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Origin', 'User-Agent', 'method'],
      credentials: true,
      maxAge: 3600,
    },
    routes: [
      {
        path: '/',
        aliases: {
          'GET /published': 'publish.getPublished',
          'GET /published/:slug': 'publish.getPublished',
        },
        bodyParsers: {
          json: true,
        },
        onBeforeCall: (ctx, route, req, res) => {
          ctx.meta.$responseType = 'application/json; charset=utf-8';
          ctx.meta.userAgent = req.headers['user-agent'];
        }
      },

      {
        path: '/',
        aliases: {
          'GET /': 'dbPages.getAll',
          'GET /:slug': 'dbPages.getHtml',
          'GET /destroy/:slug': 'dbPages.destroy',
        },
        bodyParsers: {
          json: true,
        },
        onBeforeCall: (ctx, route, req, res) => {
          ctx.meta.$responseType = { 'Content-Type': 'application/json; charset=utf-8' };
          ctx.meta.userAgent = req.headers['user-agent'];
        },
      }
    ],
  },
};
