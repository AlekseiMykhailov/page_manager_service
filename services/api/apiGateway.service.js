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
          'POST pages': 'apiHandler.createDraft',
          'POST pages/:slug': 'apiHandler.updateDraft',
          'POST pages/publish': 'apiHandler.publishPage',
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
        use: [
          function(err, req, res, next) {
            this.logger.error('Error is occured in middlewares!');
            this.sendError(req, res, err);
          }
        ],
      },

      // DRAFT JSON
      {
        path: '/drafts',
        aliases: {
          'GET /': 'apiHandler.listDraft',
          'GET /:slug': 'apiHandler.getDraft',
        },
        bodyParsers: {
          json: false,
          urlencoded: { extended: true },
        },
        onBeforeCall: (ctx, route, req, res) => {
          res.setHeader('Content-Type', 'application/json; charset=utf-8');
          ctx.meta.userAgent = req.headers['user-agent'];
        }
      },

      // DRAFT Preview
      {
        path: '/preview',
        aliases: {
          'GET /:slug': 'apiHandler.previewDraft',
        },
        bodyParsers: {
          json: false,
          urlencoded: { extended: true },
        },
        onBeforeCall: (ctx, route, req, res) => {
          res.setHeader('Content-Type', 'text/html; charset=UTF-8');
          ctx.meta.userAgent = req.headers['user-agent'];
        }
      },

      // Complete pages
      {
        path: '/api',
        cors: {
          origin: ['http://localhost:3000', 'http://localhost:3005', 'https://localhost:4000'],
          methods: ['GET'],
          allowedHeaders: ['Content-Type', 'Origin', 'User-Agent'],
          credentials: true,
          maxAge: 3600,
        },
        aliases: {
          'GET /pages/:slug': 'apiHandler.getPage',
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
