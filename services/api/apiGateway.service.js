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
      origin: '*',
      methods: ['GET', 'OPTIONS', 'POST', 'PUT', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Origin', 'User-Agent'],
      exposedHeaders: ['*'],
      credentials: false,
      maxAge: 3600,
    },
    routes: [{
      path: '/',
      aliases: {
        'POST pages': 'apiHandler.createDraft',
        'POST pages/:slug': 'apiHandler.updateDraft',
        'GET pages': 'apiHandler.listDraft',
        'GET pages/preview/:slug': 'apiHandler.getDraft',

        'POST /pages/publish': 'apiHandler.publishPage',
        // 'GET /pages/complete/:slug': 'apiHandler.getPage',

        'GET custom'(req, res) {
          res.end('<h1>hello from custom handler</h1>');
        },
        // 'GET add': 'apiHandler.createDraft',
      },
      authorization: false,
      bodyParsers: {
        json: true,
      },
    }]
  },
};
