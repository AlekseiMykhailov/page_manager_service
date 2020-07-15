const storage = {
  pages: [
    { title: 'page one', slug: 'page-one', html: `<html>
    <head>
      <title>page one</title>
    </head>
    <body>
      <h1>page one</h1>
    </body>
  </html>`},
    { title: 'page two', slug: 'page-two', html: `<html>
    <head>
      <title>page one</title>
    </head>
    <body>
      <h1>page one</h1>
    </body>
  </html>`},
  ],
};

const notFound = {
  title: 'Page Not Found',
};

module.exports = ({
  name: 'page',
  actions: {
    get(ctx) {
      return storage.pages.find(page => page.slug === ctx.params.slug) || notFound;
    },
  }
});
