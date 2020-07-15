const layout = require('./template/layout');
const heading = require('./template/heading');
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

      // console.log(html);

      return html;
    },
  }
});
