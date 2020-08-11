const Handlebars = require('handlebars');

const cssStyles = Handlebars.compile(`
  {{#each dependencies}}
    <link rel="stylesheet" href="{{ this }}">
  {{/each}}
`);

module.exports = { cssStyles };
