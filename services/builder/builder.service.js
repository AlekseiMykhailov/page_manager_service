const layout = require('./template/layout');
const heading = require('./template/heading');
const list = require('./template/list');
const form = require('./template/form');
const rowBricks = require('./template/rows/rowBricks');
const rowWithImage = require('./template/rows/rowWithImage');


module.exports = ({
  name: 'builder',
  actions: {
    create(ctx) {
      const { title, descr, rows } = ctx.params;
      const header = heading({ title });

      let rowsHtml;

      if (rows) {
        rowsHtml = rows.map(row => {
          const { title, content, blocks, image } = row;
          switch (row.type) {
          case 'bricks':
            return rowBricks({ title, content, blocks });

          case 'with-image':
            return rowWithImage({ title, content, image });

          default:
            return;
          }
        }).join('');
      }

      const html = layout({
        title,
        descr,
        header,
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
      const fields = ctx.params.fields;
      const header = heading({ title: 'Add Draft' });
      const formHtml = form({ fields });

      const html = layout({
        title: 'Add Draft',
        header,
        body: formHtml,
      });

      return html;
    }
  }
});
