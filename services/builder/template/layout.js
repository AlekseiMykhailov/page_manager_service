const Handlebars = require('handlebars');
const layout = Handlebars.compile(`
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta name="description" content="{{descr}}">
      <title>{{ title }}</title>
    </head>
    <body>
      {{ header }}
      {{ rows }}
      {{ body }}
    </body>
  </html>
`, {
  noEscape: true,
});

module.exports = layout;
