const { ServiceBroker } = require('moleculer');
const ApiService = require('moleculer-web');
const path = require('path');

const broker = new ServiceBroker();

broker.createService(ApiService);

module.exports = {
  name: 'apiGateway',
  mixins: [ApiService],
  settings: {
    port: process.env.PORT || 3010,
    cors: {
      origin: [
        'http://localhost:3000',
        'http://localhost:3010',
        'http://localhost:3011',
        'http://localhost:3012',
      ],
      methods: ['GET', 'OPTIONS', 'POST', 'PUT', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Origin', 'User-Agent', 'method'],
      credentials: true,
      maxAge: 3600,
    },
    assets: {
      // folder: path.resolve(__dirname, '..', '..', '..', '..', 'build'),
      folder: path.resolve(__dirname, '..', '..', '..', '..', 'builder', 'templates', 'default', 'assets'),
      options: {},
    },
    routes: [
      // COMMON
      {
        path: '/',
        aliases: {
          'GET /nav': 'dashboard.nav',
          'GET /homePage': 'domainSettings.getHomePageId',
          'GET /domains': 'domainSettings.getDomains',
        },
        authorization: false,
        bodyParsers: {
          json: true,
          urlencoded: { extended: true }
        },
        onBeforeCall: (ctx, route, req, res) => {
          ctx.meta.$responseType = 'application/json; charset=utf-8';
          ctx.meta.userAgent = req.headers['user-agent'];
        },
      },

      // PAGES
      {
        path: '/pages',
        aliases: {
          'GET /': 'dashboard.listWebPages',
          'GET /:slug': 'dashboard.editWebPage',
          'GET /schema': 'schemas.getWebPageSchema',
          'POST /': 'webPages.createWebPage',
          'PUT /:slug': 'webPages.updateWebPage',
          'DELETE /:slug': 'webPages.deleteWebPage',
        },
        authorization: false,
        bodyParsers: {
          json: true,
          urlencoded: { extended: true }
        },
        onBeforeCall: (ctx, route, req, res) => {
          ctx.meta.$responseType = 'application/json; charset=utf-8';
          ctx.meta.userAgent = req.headers['user-agent'];
        },
        onError(req, res, err) {
          this.logger.error('Error message: ', err.message);

          res.statusCode = 409;
          res.statusMessage = err.message;
          res.setHeader('Content-Type', 'text/plain');
          res.end(err.message);
        }
      },

      // ROWS
      {
        path: '/rows',
        aliases: {
          'POST /': 'rows.createRow',
          'PUT /:rowId': 'rows.updateRow',
          'PUT /order/:rowId': 'rows.updateRowOrder',
          'DELETE /:id': 'rows.deleteRow',
        },
        authorization: false,
        bodyParsers: {
          json: true,
          urlencoded: { extended: true }
        },
        onBeforeCall: (ctx, route, req, res) => {
          ctx.meta.$responseType = 'application/json; charset=utf-8';
          ctx.meta.userAgent = req.headers['user-agent'];
        },
      },

      // SCHEMAS
      {
        path: '/schemas',
        aliases: {
          'GET /rows': 'schemas.getRowSchemas',
        },
        authorization: false,
        bodyParsers: {
          json: true,
          urlencoded: { extended: true }
        },
        onBeforeCall: (ctx, route, req, res) => {
          ctx.meta.$responseType = 'application/json; charset=utf-8';
          ctx.meta.userAgent = req.headers['user-agent'];
        },
      },

      // PAGE PREVIEW
      {
        path: '/preview',
        aliases: {
          'GET /:slug': 'webPages.previewWebPage',
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

      // PUBLISH
      {
        path: '/publish',
        aliases: {
          'POST /': 'webPages.publishWebPage',
          'PUT /': 'webPages.updatePublishedWebPage',
          'DELETE /:slug': 'webPages.unPublishWebPage',
        },
        authorization: false,
        bodyParsers: {
          json: true,
          urlencoded: { extended: true }
        },
        onBeforeCall: (ctx, route, req, res) => {
          ctx.meta.$responseType = 'application/json; charset=utf-8';
          ctx.meta.userAgent = req.headers['user-agent'];
        },
      },

      {
        path: '/published',
        aliases: {
          'GET /': 'webPages.getAllPublishedPagesData',
          'GET /:slug': 'webPages.getPublishedPageData',
        },
        authorization: false,
        bodyParsers: {
          json: true,
          urlencoded: { extended: true }
        },
        onBeforeCall: (ctx, route, req, res) => {
          ctx.meta.$responseType = 'application/json; charset=utf-8';
          ctx.meta.userAgent = req.headers['user-agent'];
        },
      },
    ],
  },
};
