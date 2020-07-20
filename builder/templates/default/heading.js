const Handlebars = require('handlebars');
const heading = Handlebars.compile('<h1>{{title}}</h1>');

module.exports = heading;
