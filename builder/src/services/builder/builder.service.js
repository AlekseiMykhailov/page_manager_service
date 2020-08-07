const layout = require('../../../templates/default/layout');
const list = require('../../../templates/default/list');
const { rowBricks, rowWithImage } = require('../../../templates/default/rows');
const {
  addForm, editForm, editRowForm, fieldSet, inputText, inputUrl, inputFile, select, buttonHtml,
} = require('../../../templates/default/form');

module.exports = ({
  name: 'builder',
  actions: {
    create(ctx) {
      const { webPage, rows } = ctx.params;
      const { title, descr, slug } = webPage;
      const rowIds = rows.map((row) => row.id);
      let rowSchemas;

      return this.broker.call('schemas.getRowSchemas')
        .then(({ schemas }) => { rowSchemas = schemas; })
        .then(() => this.broker.call('dbFields.getFieldsByRowId', { rowIds }))
        .then(({ fields }) => {
          let rowsHtml;

          if (rows) {
            rowsHtml = [...rows].sort((a, b) => a.order - b.order)
              .map(({ id, schemaId }) => {
                const rowSchema = rowSchemas.find((schema) => schema.id === schemaId);
                const rowFields = fields.filter((field) => field.rowId === id);
                const { meta } = rowSchema;
                const { templateHbs } = meta;

                switch (templateHbs) {
                  case 'bricks':
                    return rowBricks({
                      title: rowFields.find((field) => field.name === 'title').value,
                      bricks: rowFields.filter((field) => field.name !== 'title'),
                    });

                  case 'withImage':
                    return rowWithImage({
                      backgroundImageURL: rowFields.find((field) => field.name === 'backgroundImageURL').value,
                      title: rowFields.find((field) => field.name === 'title').value,
                      description: rowFields.find((field) => field.name === 'description').value,
                    });

                  default:
                    return '';
                }
              })
              .join('');
          }

          const html = layout({
            slug,
            title,
            descr,
            canBeEdited: true,
            canBePublished: true,
            rows: rowsHtml,
          });

          return html;
        });
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
        fields: fields && Object.values(fields).map((field) => createField(field)).join(''),
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

      const rowsFieldSets = config.rows.rowsConfig.rows.map((row) => {
        const fields = row.fields && Object.values(row.fields).map((field) => (
          createField(field, row.fieldSetName))).join('');
        const blocks = row.blocks && row.blocks.map((block) => (
          fieldSet({
            title: block.name,
            fieldSetName: block.fieldSetName,
            fields: Object.values(block.fields).map((field) => createField(field, block.fieldSetName)).join(''),
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
        fields: config.fields && Object.values(config.fields).map((field) => createField(field)).join(''),
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

    createFormPageEdit(ctx) {
      const { webPage, rows, fieldTypes } = ctx.params;
      const {
        id, slug, title, description
      } = webPage;

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

      const rowsHtml = rows.sort((a, b) => a.order - b.order)
        .map((row) => {
          const {
            meta, order, id, fields
          } = row;

          return editRowForm({
            id,
            webPageSlug: slug,
            rowTitle: meta.title,
            order,
            fields: [...fields].map((field) => createField(field)).join(''),
          });
        })
        .join('');

      const formHtml = editForm({
        id,
        slug,
        title,
        description,
        rowsHtml,
      });

      const html = layout({
        title: `Edit Page: ${webPage.title}`,
        canBePublished: true,
        body: formHtml,
      });

      return html;
    },
  }
});
