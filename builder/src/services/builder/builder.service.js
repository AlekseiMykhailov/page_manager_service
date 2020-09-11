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

      const prepareFieldset = (fieldsList, fieldName) => fieldsList.filter((field) => field.name
        .startsWith(`${fieldName}`))
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

          const sectionTemplate = {
            header: () => template.header({
              title: sectionFieldsMap.title,
              description: sectionFieldsMap.description,
              backgroundImage: sectionFieldsMap.backgroundImage,
              buttons: prepareFieldset(sectionFields, 'ctaHeader'),
            }),

            benefits: () => template.benefits({
              title: sectionFieldsMap.title,
              benefits: prepareFieldset(sectionFields, 'benefits'),
            }),

            reviews: () => template.reviews({
              reviews: prepareFieldset(sectionFields, 'reviews'),
            }),

            instructors: () => template.instructors({
              title: sectionFieldsMap.title,
              description: sectionFieldsMap.description,
              instructors: prepareFieldset(sectionFields, 'instructors'),
            }),

            applyForm: () => template.applyForm({
              title: sectionFieldsMap.title,
              description: sectionFieldsMap.description,
              action: sectionFieldsMap.action,
              buttonText: sectionFieldsMap.buttonText,
              additionalFields: prepareFieldset(sectionFields, 'additionalFields'),
            }),

            default: () => {
              this.logger.error(`SECTION TEMPLATE "${sectionName}" NOT FOUND`);
              return '';
            },
          };

          return (
            (sectionTemplate[sectionName] && sectionTemplate[sectionName]())
              || sectionTemplate.default()
          );
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
