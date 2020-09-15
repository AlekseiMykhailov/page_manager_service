const template = require('../../../templates/default');

const domainOfAssets = 'localhost:3010';

module.exports = ({
  name: 'builder',
  actions: {
    async createWebPageHTML(ctx) {
      const { webPage, sections, fields } = ctx.params;
      const {
        title,
        description,
        domain,
        slug,
        disableIndexing,
        ogTitle,
        ogDescription,
        ogImage,
      } = webPage;
      const sectionSchemas = await this.broker.call('schemas.listSectionSchemas')
        .then(({ schemas }) => schemas);

      const prepareFieldsetFields = (fieldsList, fieldName) => (
        fieldsList.filter((field) => field.name.startsWith(`${fieldName}`))
      )
        .reduce((acc, field) => {
          const fieldsBlockIndex = field.name.replace(/\D/g, '');
          const fieldPublishName = field.name.split('.').reverse()[0];

          if (acc[fieldsBlockIndex]) {
            acc[fieldsBlockIndex][fieldPublishName] = field.value;
          } else {
            acc[fieldsBlockIndex] = { [fieldPublishName]: field.value };
          }

          return acc;
        }, [])
        .flat();

      if (!fields) {
        return template.layout({ slug, title, description });
      }

      const cssDependencies = new Set();
      const jsDependencies = new Set();

      const sectionsHtml = [...sections].sort((a, b) => a.order - b.order)
        .map(({ id, schema }) => {
          const currentSchema = sectionSchemas.find(({ name }) => name === schema);
          const sectionFields = fields.filter((field) => (
            field.sectionId === id && Boolean(field.value.trim())
          ));
          const sectionFieldsMap = sectionFields.reduce((fieldsMap, field) => ({
            ...fieldsMap,
            [field.name]: field.value,
          }), {});

          const { name: sectionName, dependencies } = currentSchema;
          const sectionDependencies = {
            css: dependencies.filter((dependency) => dependency.endsWith('.css')),
            js: dependencies.filter((dependency) => dependency.endsWith('.js')),
          };

          sectionDependencies.css.forEach((dependency) => { cssDependencies.add(dependency); });
          sectionDependencies.js.forEach((dependency) => { jsDependencies.add(dependency); });

          return template[sectionName]({
            ...sectionFieldsMap,
            fieldsets: currentSchema.fieldsets.reduce((acc, fieldset) => ({
              ...acc,
              [fieldset.name]: {
                ...fieldset,
                fields: prepareFieldsetFields(sectionFields, fieldset.name),
              },
            }), {}),
          });
        })
        .join('');

      const transformToUrls = (assetsDomain, type, dependencies) => ({
        dependencies: [...dependencies].map((file) => (`http://${assetsDomain}/${type}/${file}`))
      });

      const cssCode = template.cssStyles(transformToUrls(domainOfAssets, 'css', cssDependencies));
      const jsCode = template.jsScripts(transformToUrls(domainOfAssets, 'js', jsDependencies));

      const og = {
        url: `http://${domain}/${slug}`,
        title: ogTitle,
        description: ogDescription,
        image: ogImage,
      };

      const html = template.layout({
        domainOfAssets,
        slug,
        cssCode,
        jsCode,
        disableIndexing,
        title,
        description,
        og,
        sections: sectionsHtml,
      });

      return html;
    },
  }
});
