const { ServiceBroker } = require('moleculer');

const broker = new ServiceBroker();

broker.loadServices('./dashboard/src/services/');
broker.loadServices('./delivery/src/services/');
broker.loadServices('./builder/src/services/');
broker.loadServices('./db/services/');

broker.start();
