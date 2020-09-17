const Handlebars = require('handlebars');

Handlebars.registerHelper('noSections', (value) => !value);

const layout = Handlebars.compile(`
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="shortcut icon" href="{{ favicon }}" type="image/png">
    <link rel="apple-touch-icon" href="{{ webclip }}"/>

    <title>{{ title }}</title>
    <meta name="title" content="{{ title }}">
    <meta name="description" content="{{ description }}">
    
    <meta property="og:type" content="website">
    <meta property="og:url" content="{{ og.url }}">
    <meta property="og:title" content="{{ og.title }}">
    <meta property="og:description" content="{{ og.description }}">
    <meta property="og:image" content="{{ og.image }}">
    
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:url" content="{{ og.url }}">
    <meta property="twitter:title" content="{{ og.title }}">
    <meta property="twitter:description" content="{{ og.description }}">
    <meta property="twitter:image" content="{{ og.image }}">

    <link rel="stylesheet" href="http://{{ domainOfAssets }}/css/index.css">
    {{#if cssCode}}{{{ cssCode }}}{{/if}}
    {{#if disableIndexing}}
      <meta name="robots" content="noindex">
    {{/if}}
  </head>

  <body>
    {{#if (noSections sections)}}
      <div class="temp">
        <h1>{{ title }}</h1>
        <h2>{{ description }}</h2>
      </temp>
    {{/if}}
    {{ sections }}
    {{#if jsCode}}{{{ jsCode }}}{{/if}}
  </body>
</html>
`, {
  noEscape: true,
});

module.exports = { layout };
