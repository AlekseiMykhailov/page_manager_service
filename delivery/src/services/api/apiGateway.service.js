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
        path: '/api',
        cors: {
          origin: [
            'http://localhost:3000',
            'http://localhost:3001',
            'http://localhost:3002',
            'https://localhost:4000',
            'https://localhost:5000',
          ],
          methods: ['GET'],
          allowedHeaders: ['Content-Type', 'Origin', 'User-Agent'],
          credentials: true,
          maxAge: 3600,
        },
        aliases: {
          'GET /pages': 'publish.getWebPage',
          'GET /pages/:slug': 'publish.getWebPage',
        },
        bodyParsers: {
          json: true,
        },
        onBeforeCall: (ctx, route, req, res) => {
          ctx.meta.$responseType = 'application/json; charset=utf-8';
          ctx.meta.userAgent = req.headers['user-agent'];
        }
      }
    ],
  },
};
