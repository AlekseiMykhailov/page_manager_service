const { layout } = require('../../../templates/default/layout');
const { cssStyles } = require('../../../templates/default/cssStyles');
const { jsScripts } = require('../../../templates/default/jsScripts');
const { rowBricks, rowWithImage } = require('../../../templates/default/rows');

module.exports = ({
  name: 'builder',
  actions: {
    createWebPageHTML(ctx) {
      const { webPage, rows } = ctx.params;
      const { title, description, slug } = webPage;
      const rowIds = rows.map((row) => row.id);
      let rowSchemas;

      return this.broker.call('schemas.getRowSchemas')
        .then(({ schemas }) => { rowSchemas = schemas; })
        .then(() => this.broker.call('dbFields.getFieldsByRowId', { rowIds }))
        .then(({ fields }) => {
          if (!rows) {
            return layout({
              slug,
              title,
              description,
            });
          }

          const cssDependencies = new Set();
          const jsDependencies = new Set();

          const rowsHtml = [...rows].sort((a, b) => a.order - b.order)
            .map(({ id, schemaId }) => {
              const rowSchema = rowSchemas.find((schema) => schema.id === schemaId);
              const rowFields = fields.filter((field) => field.rowId === id);
              const rowFieldsMap = {};
              const { meta, dependencies } = rowSchema;
              const { templateHbs } = meta;
              const rowDependencies = {
                css: dependencies.filter((dependency) => dependency.endsWith('.css')),
                js: dependencies.filter((dependency) => dependency.endsWith('.js')),
              };

              rowFields.forEach((field) => {
                rowFieldsMap[field.name] = field.value;
              });

              if (rowDependencies.css.length > 0) {
                cssDependencies.add(...rowDependencies.css);
              }

              if (rowDependencies.js.length > 0) {
                jsDependencies.add(...rowDependencies.js);
              }

              const rowTemplate = {
                bricks: () => rowBricks({
                  title: rowFieldsMap.title,
                  bricks: rowFields.filter((field) => field.name !== 'title'),
                }),

                withImage: () => rowWithImage({
                  title: rowFieldsMap.title,
                  backgroundImageURL: rowFieldsMap.backgroundImageURL,
                  description: rowFieldsMap.description,
                }),

                default: () => {
                  this.logger.error(`ROW TEMPLATE "${templateHbs}" NOT FOUND`);
                  return '';
                },
              };
              return (rowTemplate[templateHbs]() || rowTemplate.default());
            })
            .join('');

          const domainOfAssets = 'localhost:3010';
          const cssFiles = cssStyles({
            cssDependencies: [...cssDependencies].map((cssFile) => `http://${domainOfAssets}/css/${cssFile}`),
          });
          const jsFiles = jsScripts({
            jsDependencies: [...jsDependencies].map((jsFile) => `http://${domainOfAssets}/js/${jsFile}`),
          });

          const html = layout({
            domainOfAssets,
            slug,
            cssFiles,
            jsFiles,
            title,
            description,
            rows: rowsHtml,
          });

          return html;
        });
    },
  }
});
