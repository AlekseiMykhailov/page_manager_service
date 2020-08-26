const template = require('../../../templates/default');

const domainOfAssets = 'localhost:3010';

module.exports = ({
  name: 'builder',
  actions: {
    createWebPageHTML(ctx) {
      const { webPage, sections } = ctx.params;
      const { title, description, slug } = webPage;
      const sectionIds = sections.map((section) => section.id);
      let sectionSchemas;

      return this.broker.call('schemas.getSectionSchemas')
        .then(({ schemas }) => { sectionSchemas = schemas; })
        .then(() => this.broker.call('dbFields.getFieldsBySectionId', { sectionIds }))
        .then(({ fields }) => {
          if (!fields) {
            return template.layout({ slug, title, description });
          }

          const cssDependencies = new Set();
          const jsDependencies = new Set();

          const sectionsHtml = [...sections].sort((a, b) => a.order - b.order)
            .map(({ id, schemaId }) => {
              const sectionSchema = sectionSchemas.find((schema) => schema.id === schemaId);
              const sectionFields = fields.filter((field) => (
                field.sectionId === id && Boolean(field.value.trim())
              ));
              const sectionFieldsMap = sectionFields.reduce((fieldsMap, field) => ({
                ...fieldsMap,
                [field.name]: field.value,
              }), {});
              const { meta, dependencies } = sectionSchema;
              const { templateHbs } = meta;
              const sectionDependencies = {
                css: dependencies.filter((dependency) => dependency.endsWith('.css')),
                js: dependencies.filter((dependency) => dependency.endsWith('.js')),
              };

              if (sectionDependencies.css.length > 0) {
                cssDependencies.add(...sectionDependencies.css);
              }

              if (sectionDependencies.js.length > 0) {
                jsDependencies.add(...sectionDependencies.js);
              }

              const sectionTemplate = {
                header: () => template.header({
                  title: sectionFieldsMap.title,
                  bricks: sectionFields.filter((field) => field.name.startsWith('brick')),
                }),

                benefits: () => template.benefits({
                  title: sectionFieldsMap.title,
                  backgroundImageURL: sectionFieldsMap.backgroundImageURL,
                  description: sectionFieldsMap.description,
                }),

                default: () => {
                  this.logger.error(`SECTION TEMPLATE "${templateHbs}" NOT FOUND`);
                  return '';
                },
              };

              return (sectionTemplate[templateHbs]() || sectionTemplate.default());
            })
            .join('');

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
            sections: sectionsHtml,
          });

          return html;
        });
    },
  }
});
