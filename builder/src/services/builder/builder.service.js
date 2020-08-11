const template = require('../../../templates/default');

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
          if (!fields) {
            return template.layout({ slug, title, description });
          }

          const cssDependencies = new Set();
          const jsDependencies = new Set();

          const rowsHtml = [...rows].sort((a, b) => a.order - b.order)
            .map(({ id, schemaId }) => {
              const rowSchema = rowSchemas.find((schema) => schema.id === schemaId);
              const rowFields = fields.filter((field) => (
                field.rowId === id && Boolean(field.value.trim())
              ));
              const rowFieldsMap = rowFields.reduce((fieldsMap, field) => ({
                ...fieldsMap,
                [field.name]: field.value,
              }), {});
              const { meta, dependencies } = rowSchema;
              const { templateHbs } = meta;
              const rowDependencies = {
                css: dependencies.filter((dependency) => dependency.endsWith('.css')),
                js: dependencies.filter((dependency) => dependency.endsWith('.js')),
              };

              if (rowDependencies.css.length > 0) {
                cssDependencies.add(...rowDependencies.css);
              }

              if (rowDependencies.js.length > 0) {
                jsDependencies.add(...rowDependencies.js);
              }

              const rowTemplate = {
                bricks: () => template.rowBricks({
                  title: rowFieldsMap.title,
                  bricks: rowFields.filter((field) => field.name.startsWith('edge')),
                }),

                withImage: () => template.rowWithImage({
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
          const transformToUrls = (domain, type, dependencies) => ({
            dependencies: [...dependencies].map((file) => (`http://${domain}/${type}/${file}`))
          });

          const cssCode = template.cssStyles(transformToUrls(domainOfAssets, 'css', cssDependencies));
          const jsCode = template.jsScripts(transformToUrls(domainOfAssets, 'js', jsDependencies));

          const html = template.layout({
            domainOfAssets,
            slug,
            cssCode,
            jsCode,
            title,
            description,
            rows: rowsHtml,
          });

          return html;
        });
    },
  }
});
