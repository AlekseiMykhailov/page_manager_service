const Handlebars = require('handlebars');

const jsScripts = Handlebars.compile(`
  {{#each jsDependencies}}
    <script src="{{ this }}" defer></script>
  {{/each}}
`);

module.exports = { jsScripts };
