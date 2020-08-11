const Handlebars = require('handlebars');

const jsScripts = Handlebars.compile(`
  {{#each dependencies}}
    <script src="{{ this }}" defer></script>
  {{/each}}
`);

module.exports = { jsScripts };
