const Handlebars = require('handlebars');

const jsScripts = Handlebars.compile(`
  {{#each dependencies}}
    <script src="{{ this }}" type="text/javascript"></script>
  {{/each}}
`);

module.exports = { jsScripts };
