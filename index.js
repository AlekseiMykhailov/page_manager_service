const { ServiceBroker } = require('moleculer');
const broker = new ServiceBroker();

broker.loadServices('./dashboard/services/');
broker.loadServices('./delivery/services/');
broker.loadServices('./builder/services/');
broker.start();
