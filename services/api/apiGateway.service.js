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
      // DRAFT CREATE
      {
        path: '/pages',
        aliases: {
          'POST /': 'draft.add',
          'POST /:slug': 'draft.update',
          'POST /publish': 'draft.publish',
        },
        authorization: false,
        bodyParsers: {
          json: true,
          urlencoded: { extended: true }
        },
        onBeforeCall: (ctx, route, req, res) => {
          ctx.meta.$responseType = { 'Content-Type': 'application/json; charset=utf-8' };
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
          'GET /:slug': 'draft.get',
        },
        bodyParsers: {
          json: true,
        },
        onBeforeCall: (ctx, route, req, res) => {
          ctx.meta.$responseType = 'application/json; charset=utf-8';
          ctx.meta.userAgent = req.headers['user-agent'];
        }
      },

      // DASHBOARD
      {
        path: '/',
        aliases: {
          'GET /': 'dashboard.dashboard',
          'GET /add': 'dashboard.addDraft',
          'GET /drafts': 'dashboard.draftList',
        },
        bodyParsers: {
          json: false,
          urlencoded: { extended: true },
        },
        onBeforeCall: (ctx, route, req, res) => {
          ctx.meta.$responseType = 'text/html; charset=utf-8';
          ctx.meta.userAgent = req.headers['user-agent'];
        }
      },

      // DRAFT Preview HTML
      {
        path: '/preview',
        aliases: {
          'GET /': 'draft.previewList',
          'GET /:domain/:slug': 'draft.previewDraft',
        },
        bodyParsers: {
          json: false,
          urlencoded: { extended: true },
        },
        onBeforeCall: (ctx, route, req, res) => {
          ctx.meta.$responseType = 'text/html; charset=utf-8';
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
          ctx.meta.$responseType = 'application/json; charset=utf-8';
          ctx.meta.userAgent = req.headers['user-agent'];
        }
      }
    ],
  },
};
