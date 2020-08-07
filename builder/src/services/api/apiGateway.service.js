const { ServiceBroker } = require('moleculer');
const ApiService = require('moleculer-web');

const broker = new ServiceBroker();

broker.createService(ApiService);

module.exports = {
  name: 'apiGateway',
  mixins: [ApiService],
  settings: {
    port: process.env.BUILDER_PORT || 3012,
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
  },
};
