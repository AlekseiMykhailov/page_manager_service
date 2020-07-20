const layout = require('../../templates/default/layout');
const heading = require('../../templates/default/heading');
const list = require('../../templates/default/list');
const { rowBricks, rowWithImage } = require('../../templates/default/rows');
const {
  addForm, editForm, fieldSet, inputText, inputUrl, inputFile, select, buttonHtml,
} = require('../../templates/default/form');

module.exports = ({
  name: 'builder',
  actions: {
    create(ctx) {
      const { title, descr, rows, domain, slug } = ctx.params;
      const header = heading({ title });

      let rowsHtml;

      if (rows) {
        rowsHtml = rows.map(row => {
          const { title, bricks, content, image } = row;
          switch (row.type) {
          case 'bricks':
            return rowBricks({ title, bricks });

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
      const { items, title } = ctx.params;
      const listHtml = list({ items });
      const html = layout({
        title,
        body: listHtml,
      });

      return html;
    },

    createAddPageForm(ctx) {
      const { actionURL, fields, fieldTypes } = ctx.params;
      const createField = (field) => {
        if (field.type === fieldTypes.text) {
          return inputText({ ...field });
        }
        if (field.type === fieldTypes.url) {
          return inputUrl({ ...field });
        }
        if (field.type === fieldTypes.file) {
          return inputFile({ ...field });
        }
        if (field.type === fieldTypes.select) {
          return select({ ...field });
        }
      };

      const formHtml = addForm({
        actionURL,
        fields: fields && Object.values(fields).map(field => createField(field)).join(''),
        button: buttonHtml({ text: 'Submit', type: 'submit' })
      });

      const html = layout({
        title: 'Create Web Page',
        body: formHtml,
      });

      return html;
    },

    createFormOld(ctx) {
      // TODO: delete this after make new method
      const { config, fieldTypes } = ctx.params;
      const createField = (field, fieldSetName) => {
        if (field.type === fieldTypes.text) {
          return inputText({ ...field, fieldSetName });
        }
        if (field.type === fieldTypes.url) {
          return inputUrl({ ...field, fieldSetName });
        }
        if (field.type === fieldTypes.file) {
          return inputFile({ ...field, fieldSetName });
        }
        if (field.type === fieldTypes.select) {
          return select({ ...field, fieldSetName });
        }
      };

      const rowsFieldSets = config.rows.rowsConfig.rows.map(row => {
        const fields = row.fields && Object.values(row.fields).map(field => (
          createField(field, row.fieldSetName))
        ).join('');
        const blocks = row.blocks && row.blocks.map(block => (
          fieldSet({
            title: block.name,
            fieldSetName: block.fieldSetName,
            fields: Object.values(block.fields).map(field => createField(field, block.fieldSetName)).join(''),
          })
        )).join('');
        // TODO: change the output from all types of block to select and add one of a selected type

        return fieldSet({
          title: row.name,
          fieldSetName: row.fieldSetName,
          button: buttonHtml({ text: '+', className: 'button--round', type: 'button' }),
          fields,
          blocks,
        });
      }).join('');

      const formHtml = addForm({
        fields: config.fields && Object.values(config.fields).map(field => createField(field)).join(''),
        fieldSet: rowsFieldSets,
        button: buttonHtml({ text: 'Submit', type: 'submit' })
      });

      this.logger.info('CTX PARAMS CREATE FORM:  ', ctx.params);

      const html = layout({
        title: config.name,
        body: formHtml,
      });

      return html;
    },

    createEditPageForm(ctx) {
      const { fields } = ctx.params;

      const formHtml = editForm({
        slug: fields.slug,
        title: fields.title,
        description: fields.description
      });

      const html = layout({
        title: `Edit Page: ${fields.title}`,
        canBePublished: true,
        body: formHtml,
      });

      return html;
    },
  }
});
