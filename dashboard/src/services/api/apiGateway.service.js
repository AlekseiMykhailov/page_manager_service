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
      folder: path.resolve(__dirname, '..', '..', '..', '..', 'builder', 'templates', 'default', 'assets'),
      options: {},
    },
    routes: [
      // DOMAINS SETTINGS
      {
        path: '/domains',
        aliases: {
          'GET /:domain': 'domainSettings.getDomainSettings',
          'GET /': 'domainSettings.getDomains',
          'PUT /': 'domainSettings.setDomainSettings',
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
          'GET /': 'webPages.getListWebPages',
          'GET /:id': 'webPages.editWebPage',
          'POST /': 'webPages.createWebPage',
          'POST /clone': 'webPages.cloneWebPage',
          'PUT /:id': 'webPages.updateWebPage',
          'DELETE /:id': 'webPages.deleteWebPage',
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

      {
        path: '/redirects',
        aliases: {
          'POST /': 'webPages.addWebPageRedirect',
          'DELETE /:redirectId': 'webPages.deleteWebPageRedirect',
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

      // SECTIONS
      {
        path: '/sections',
        aliases: {
          'POST /': 'sections.createSection',
          'PUT /:sectionId': 'sections.updateSectionFields',
          'PUT /order/:sectionId': 'sections.updateSectionOrder',
          'DELETE /:id': 'sections.deleteSection',
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
          'GET /sections': 'schemas.getSectionSchemas',
          'GET /pages': 'schemas.getWebPageSchema',
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
          'GET /:pageId': 'webPages.previewWebPage',
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
          'GET /': 'webPages.listPublishedWebPages',
          'GET /:id': 'webPages.getPublishedWebPage',
          'POST /': 'webPages.publishWebPage',
          'PUT /': 'webPages.updatePublishedWebPage',
          'DELETE /:id': 'webPages.unPublishWebPage',
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
