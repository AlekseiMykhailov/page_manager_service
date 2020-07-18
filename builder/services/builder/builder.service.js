const layout = require('../../template/default/layout');
const heading = require('../../template/default/heading');
const list = require('../../template/default/list');
const form = require('../../template/default/form/addForm');
const editForm = require('../../template/default/form/editForm');
const rowBricks = require('../../template/default/rows/bricks');
const rowWithImage = require('../../template/default/rows/withImage');
const { formAddConfig } = require('../../template/default/form/formAddConfig');
const { fieldSet } = require('../../template/default/form/fieldSet');
const { inputText, inputUrl, inputFile } = require('../../template/default/form/fields');
const { buttonHtml } = require('../../template/default/form/button');

const { rowsConfig } = require('../../template/default/rows/config');
const FIELD_TYPE = require('../../template/default/constants');

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
      const createField = (field) => {
        if (field.type === FIELD_TYPE.text) {
          return inputText({ ...field });
        }
        if (field.type === FIELD_TYPE.url) {
          return inputUrl({ ...field });
        }
        if (field.type === FIELD_TYPE.file) {
          return inputFile({ ...field });
        }
      };

      console.log('##### ', rowsConfig.fields);

      const rowsFieldSets = rowsConfig.rows.map(row => {
        const fields = row.fields && Object.values(row.fields).map(field => createField(field)).join('');
        const blocks = row.blocks && row.blocks.map(block => (
          fieldSet({
            title: block.name,
            fields: Object.values(block.fields).map(field => createField(field)).join(''),
          })
        )).join('');
        // TODO: change the output from all types of block to select and add one of a selected type

        return fieldSet({
          title: row.name,
          button: buttonHtml({ text: '+', className: 'button--round', type: 'button' }),
          fields,
          blocks,
        });
      }).join('');

      const formHtml = form({
        h1: formAddConfig.name,
        fields: formAddConfig.fields && Object.values(formAddConfig.fields).map(field => createField(field)).join(''),
        fieldSet: rowsFieldSets,
        button: buttonHtml({ text: 'Submit', type: 'submit' })
      });

      console.log('!!!!!! ', formAddConfig.fields);
      console.log('!!!!!! ', formAddConfig.fields && Object.values(formAddConfig.fields).map(field => createField(field)).join(''));
      // this.logger.info('************** ROWS *************', rowsFieldSets);

      const html = layout({
        title: formAddConfig.name,
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

      return html;
    },

    // TODO: Implement this for form fields
    createFieldHTML(ctx) {
      const { field } = ctx.params;

      if (field.type === FIELD_TYPE.text) {
        return inputText({ ...field });
      }
      if (field.type === FIELD_TYPE.url) {
        return inputText({ ...field });
      }
      if (field.type === FIELD_TYPE.file) {
        return inputFile({ ...field });
      }
    },
  }
});
