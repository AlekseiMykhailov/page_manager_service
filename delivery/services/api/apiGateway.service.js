const { ServiceBroker } = require('moleculer');
const ApiService = require('moleculer-web');
const broker = new ServiceBroker();

broker.createService(ApiService);

module.exports = {
  name: 'apiGateway',
  mixins: [ApiService],
  settings: {
    port: 3001,
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
          'GET /pages': 'page.get',
          'GET /pages/:domain': 'page.get',
          'GET /pages/:domain/:slug': 'page.get',
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
