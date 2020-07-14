const storage = {
  pages: [
    { title: 'page one', slug: 'page-one'},
    { title: 'page two', slug: 'page-two'},
  ],
};

module.exports = ({
  name: 'page',
  actions: {
    get(ctx) {
      return storage.pages.find(page => page.slug === ctx.params.slug) || 'Page Not Found';
    },
  }
});
