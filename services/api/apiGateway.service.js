const { ServiceBroker } = require('moleculer');
const ApiService = require('moleculer-web');
const broker = new ServiceBroker();

broker.createService(ApiService);

module.exports = {
  name: 'apiGateway',
  mixins: [ApiService],
  settings: {
    port: 3000,
    cors: {
      origin: ['http://localhost:3000', 'http://localhost:3005', 'https://localhost:4000'],
      methods: ['GET', 'OPTIONS', 'POST', 'PUT', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Origin', 'User-Agent', 'method'],
      credentials: true,
      maxAge: 3600,
    },
    routes: [
      {
        path: '/',
        aliases: {
          'POST pages': 'draft.add',
          'POST pages/:slug': 'draft.update',
          'POST pages/publish': 'draft.publish',
        },
        authorization: false,
        bodyParsers: {
          json: true,
          urlencoded: { extended: true }
        },
        onBeforeCall: (ctx, route, req, res) => {
          res.setHeader('Content-Type', 'application/x-www-form-urlencoded');
          ctx.meta.userAgent = req.headers['user-agent'];
        },
        onError(req, res, err) {
          this.logger.info('Error message: ', err.message);

          res.statusCode = 409;
          res.statusMessage = err.message;
          res.setHeader('Content-Type', 'text/plain');
          res.end(err.message);
        }
      },

      // DRAFT JSON
      {
        path: '/drafts',
        aliases: {
          'GET /': 'draft.list',
          'GET /:slug': 'draft.get',
        },
        bodyParsers: {
          json: true,
        },
        onBeforeCall: (ctx, route, req, res) => {
          res.setHeader('Content-Type', 'application/json; charset=utf-8');
          ctx.meta.userAgent = req.headers['user-agent'];
        }
      },

      // DRAFT Preview HTML
      {
        path: '/preview',
        aliases: {
          'GET /:domain/:slug': 'draft.preview',
        },
        bodyParsers: {
          json: false,
          urlencoded: { extended: true },
        },
        onBeforeCall: (ctx, route, req, res) => {
          console.log('GATEWAY - PREVIEW: SET header and userAgent');

          res.setHeader('Content-Type', 'text/html; charset=UTF-8');
          ctx.meta.userAgent = req.headers['user-agent'];
        }
      },

      // Complete pages API
      {
        path: '/api',
        cors: {
          origin: [
            'http://localhost:3000',
            'http://localhost:3005',
            'https://localhost:4000',
            'https://localhost:5000',
          ],
          methods: ['GET'],
          allowedHeaders: ['Content-Type', 'Origin', 'User-Agent'],
          credentials: true,
          maxAge: 3600,
        },
        aliases: {
          'GET /pages/:domain/:slug': 'page.get',
        },
        bodyParsers: {
          json: true,
        },
        onBeforeCall: (ctx, route, req, res) => {
          res.setHeader('Content-Type', 'application/json; charset=utf-8');
          ctx.meta.userAgent = req.headers['user-agent'];
        }
      }
    ],
  },
};
