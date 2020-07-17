const layout = require('./template/layout');
const heading = require('./template/heading');
const list = require('./template/list');
const form = require('./template/form');
const editForm = require('./template/editForm');
const rowBricks = require('./template/rows/rowBricks');
const rowWithImage = require('./template/rows/rowWithImage');


module.exports = ({
  name: 'builder',
  actions: {
    create(ctx) {
      const { title, descr, rows, domain, slug } = ctx.params;
      const header = heading({ title });

      let rowsHtml;

      if (rows) {
        rowsHtml = rows.map(row => {
          const { title, content, blocks, image } = row;
          switch (row.type) {
          case 'bricks':
            return rowBricks({ title, bricks: content, blocks });

          case 'with-image':
            return rowWithImage({ title, content, image });

          default:
            return;
          }
        }).join('');
      }

      const html = layout({
        domain,
        slug,
        title,
        descr,
        header,
        canBeEdited: true,
        canBePublished: true,
        rows: rowsHtml,
      });

      return html;
    },

    createList(ctx) {
      const { title, h1 } = ctx.params;
      const items = ctx.params.list;
      const listHtml = list({ items });

      this.logger.info('createList List: ', ctx.params);

      const html = layout({
        title,
        h1,
        body: listHtml,
      });

      return html;
    },

    createForm(ctx) {
      const { fields, h1 } = ctx.params;
      const formHtml = form({ fields, h1 });

      const html = layout({
        title: 'Add Draft',
        body: formHtml,
      });

      return html;
    },

    createEditForm(ctx) {
      const {  h1, fields, domain, slug, title, descr } = ctx.params;
      const formHtml = editForm({ h1, fields, domain, slug, title, descr});

      const html = layout({
        title,
        canBePublished: true,
        body: formHtml,
      });

      this.logger.info('Create Edit Form: ', ctx.params);

      return html;
    },
  }
});
