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
          const cssDependencies = new Set();
          const jsDependencies = new Set();
          let rowsHtml;

          if (rows) {
            rowsHtml = [...rows].sort((a, b) => a.order - b.order)
              .map(({ id, schemaId }) => {
                const rowSchema = rowSchemas.find((schema) => schema.id === schemaId);
                const rowFields = fields.filter((field) => field.rowId === id);
                const rowFieldsMap = {};
                const { meta, dependencies } = rowSchema;
                const { templateHbs } = meta;
                const rowCssDependencies = dependencies.filter((dependency) => dependency.endsWith('.css'));
                const rowJsDependencies = dependencies.filter((dependency) => dependency.endsWith('.js'));

                rowFields.forEach((field) => {
                  rowFieldsMap[field.name] = field.value;
                });

                if (rowCssDependencies.length > 0) {
                  cssDependencies.add(...rowCssDependencies);
                }

                if (rowJsDependencies.length > 0) {
                  jsDependencies.add(...rowJsDependencies);
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

                  default: () => '',
                };
                return (rowTemplate[templateHbs]() || rowTemplate.default());
              })
              .join('');
          }

          const assetsDomain = 'localhost:3010';
          const cssFiles = cssStyles({
            cssDependencies: [...cssDependencies].map((cssFile) => `http://${assetsDomain}/css/${cssFile}`),
          });
          const jsFiles = jsScripts({
            jsDependencies: [...jsDependencies].map((jsFile) => `http://${assetsDomain}/js/${jsFile}`),
          });

          const html = layout({
            assetsDomain,
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
