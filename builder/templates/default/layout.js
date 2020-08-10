const Handlebars = require('handlebars');

Handlebars.registerHelper('noRows', (value) => !value);

const layout = Handlebars.compile(`
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="shortcut icon" href="http://{{ assetsDomain }}/images/favicon.ico" type="image/png">
    <meta name="description" content="{{ description }}">
    <title>{{ title }}</title>
    <link rel="stylesheet" href="http://{{ assetsDomain }}/css/index.css">
    {{#if cssFiles}}{{{ cssFiles }}}{{/if}}
    {{#if jsFiles}}{{{ jsFiles }}}{{/if}}
  </head>

  <body>
    {{#if (noRows rows)}}
      <div class="temp">
        <h1>{{ title }}</h1>
        <h2>{{ description }}</h2>
      </temp>
    {{/if}}
    {{ rows }}
  </body>
</html>
`, {
  noEscape: true,
});

module.exports = { layout };
