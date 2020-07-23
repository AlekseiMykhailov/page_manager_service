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
      // DASHBOARD
      {
        path: '/',
        aliases: {
          'GET /': 'dashboard.dashboard',
          'GET /pages': 'dashboard.listWebPages',
          'GET /pages/create': 'dashboard.createWebPage',
          'GET /pages/:slug': 'dashboard.editWebPage',
        },
        bodyParsers: {
          json: false,
          urlencoded: { extended: true },
        },
        onBeforeCall: (ctx, route, req, res) => {
          ctx.meta.$responseType = 'text/html; charset=utf-8';
          ctx.meta.userAgent = req.headers['user-agent'];
        },
      },

      // PAGES CREATE, UPDATE AND PUBLISH
      {
        path: '/api',
        aliases: {
          'GET /nav': 'dashboard.nav',
          'GET /pages': 'dashboard.listWebPages',
          'GET /pages/:slug': 'dashboard.editWebPage',
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
      },

      // PAGES CREATE, UPDATE AND PUBLISH
      {
        path: '/pages',
        aliases: {
          'POST /': 'pages.createWebPage',
          'PUT /:slug': 'pages.updateWebPage',
          'POST /publish': 'pages.publish',
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
          'DELETE /:id': 'rows.deleteRow',
          'GET /schemas': 'rows.getRowSchemas',
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
      },

      // PAGE PREVIEW
      {
        path: '/preview',
        aliases: {
          'GET /': 'pages.previewWebPageList',
          'GET /:slug': 'pages.previewWebPage',
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
    ],
  },
};
