const Handlebars = require('handlebars');

const cssStyles = Handlebars.compile(`
  {{#each cssDependencies}}
    <link rel="stylesheet" href="{{ this }}">
  {{/each}}
`);

module.exports = { cssStyles };
