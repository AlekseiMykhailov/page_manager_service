const Handlebars = require('handlebars');
const headerTemplate = Handlebars.compile('<h1>PageName: {{title}}</h1>');
const initial = Handlebars.compile(`
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Main Layout</title>
    </head>
    <body>
      {{header}}
    </body>
  </html>
`, {
  noEscape: true,
});

module.exports = ({
  name: 'builder',
  actions: {
    create(ctx) {
      const header = headerTemplate({ title: ctx.params.title });
      // console.log(header);
      return initial({ header });
    },
  }
});

