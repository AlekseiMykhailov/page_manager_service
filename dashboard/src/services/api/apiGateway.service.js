const { ServiceBroker } = require('moleculer');
const ApiService = require('moleculer-web');

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
        'http://localhost:3001',
        'http://localhost:3002',
      ],
      methods: ['GET', 'OPTIONS', 'POST', 'PUT', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Origin', 'User-Agent', 'method'],
      credentials: true,
      maxAge: 3600,
    },
    assets: {
      // TODO: this don't work and need to fix it
      folder: './public',
      options: {}
    },
    routes: [
      // COMMON
      {
        path: '/',
        aliases: {
          'GET /nav': 'dashboard.nav',
          'GET /settings': 'settings.getHomePageId',
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
          'GET /schemas': 'schemas.getRowSchemas',
          'POST /': 'rows.createRow',
          'PUT /:rowId': 'rows.updateRow',
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

      // PAGE PREVIEW
      {
        path: '/preview',
        aliases: {
          'GET /': 'webPages.previewWebPageList',
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
