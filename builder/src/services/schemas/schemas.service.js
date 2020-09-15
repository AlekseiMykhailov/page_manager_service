const domainSettingsSchema = [
  {
    name: 'homePageId',
    type: 'select',
    title: 'Home Page',
    description: 'Home Page of the Site',
    value: '',
    order: 100,
  },
  {
    name: 'favicon',
    type: 'url',
    title: 'Favicon',
    description: 'Favicon',
    value: '',
    order: 200,
  },
  {
    name: 'webclip',
    type: 'url',
    title: 'Webclip',
    description: 'Webclip',
    value: '',
    order: 300,
  },
  {
    name: 'robotsTxt',
    type: 'textarea',
    title: 'File robots.txt',
    description: 'File robots.txt',
    value: '',
    order: 400,
  },
];

const webPageSchema = [
  {
    name: 'title',
    type: 'text',
    title: 'Title',
    description: 'Title of the Web Page',
    value: '',
    order: 100,
  },
  {
    name: 'description',
    type: 'text',
    title: 'Description',
    description: 'Description',
    value: '',
    order: 200,
  },
  {
    name: 'domain',
    type: 'select',
    title: 'Domain',
    description: 'Domain',
    value: '',
    order: 300,
  },
  {
    name: 'slug',
    type: 'text',
    title: 'Slug',
    description: 'Slug',
    value: '',
    order: 400,
  },
  {
    name: 'disableIndexing',
    type: 'checkbox',
    title: 'Not index',
    description: 'Exclude this page from site search results',
    value: false,
    order: 500,
  },
  {
    name: 'ogTitle',
    type: 'text',
    title: 'OG:Title',
    description: 'Open Graph Title',
    value: '',
    order: 600,
  },
  {
    name: 'ogDescription',
    type: 'text',
    title: 'OG:Description',
    description: 'Open Graph Description',
    value: '',
    order: 700,
  },
  {
    name: 'ogDefault',
    type: 'checkbox',
    title: 'Create OG from Meta',
    description: 'Create OG from Title and Description',
    value: true,
    order: 800,
  },
  {
    name: 'ogImage',
    type: 'url', // TODO: It should be changed to select when OG:Image collections will be ready
    title: 'OG:Image',
    description: 'Open Graph Image',
    value: '',
    order: 900,
  },
];

const sectionCreateSchema = [
  {
    name: 'type',
    type: 'hidden',
    value: 'section',
  },
  {
    name: 'json',
    type: 'textarea',
    title: 'JSON',
    description: 'JSON',
    value: '', // TODO: create default JSON
    order: 200,
  },
];

const instructorSchema = [
  {
    name: 'name',
    type: 'text',
    title: 'Name',
    description: 'First and Last Name',
    value: '',
    order: 100,
  },
  {
    name: 'about',
    type: 'text',
    title: 'About',
    description: 'Short About of the Instructor',
    value: '',
    order: 200,
  },
  {
    name: 'photo',
    type: 'text',
    title: 'Photo',
    description: 'Photo',
    value: '',
    order: 300,
  },
  {
    name: 'linkedIn',
    type: 'url',
    title: 'LinkedIn Link',
    description: 'Link to LinkedIn Profile',
    value: '',
    order: 400,
  },
  {
    name: 'facebook',
    type: 'url',
    title: 'Facebook Link',
    description: 'Link to Facebook Profile',
    value: '',
    order: 500,
  },
  {
    name: 'email',
    type: 'email',
    title: 'Email',
    description: 'Email',
    value: '',
    order: 600,
  },
];

module.exports = ({
  name: 'schemas',
  actions: {
    getDomainSettingsSchema: {
      async handler(ctx) {
        const { domain } = ctx.params;
        const [homePageId, listWebPages, listPublished] = await Promise.all([
          this.broker.call('domainSettings.getHomePageId', { domain }),
          this.broker.call('dbWebPages.listWebPages'),
          this.broker.call('dbPublishedPage.listPublishedPages'),
        ]);

        const publishedWebPages = listWebPages.filter((page) => page.domain === domain)
          .filter((page) => listPublished.some((published) => published.webPageId === page.id));

        const schema = domainSettingsSchema.map((field) => {
          if (field.name === 'homePageId') {
            return {
              ...field,
              options: publishedWebPages,
              value: homePageId,
            };
          }
          return field;
        });

        return { ok: true, schema };
      },
    },

    getWebPageSchema: {
      async handler() {
        const domains = await this.broker.call('dbDomainSettings.listDomains');

        return {
          ok: true,
          schema: webPageSchema,
          domains,
        };
      },
    },

    getSectionSchema: {
      async handler(ctx) {
        const { sectionName } = ctx.params;
        const schema = await this.broker.call('dbSchemas.listSchemas')
          .then(({ schemas }) => schemas.find(({ name }) => (name === sectionName)))
          .then(({ json }) => json);

        return {
          ok: true,
          schema,
        };
      }
    },

    listSectionSchemas: {
      async handler() {
        const instructorSelectOptions = await this.broker.call('instructors.listOptions');
        const sectionsSchemas = await this.broker.call('dbSchemas.listSchemas')
          .then(({ schemas }) => schemas.map((schema) => ({
            id: schema.id,
            ...schema.json
          })));

        const schemas = sectionsSchemas.map((schema) => {
          if (schema.name === 'instructors') {
            return this.addOptions(schema, instructorSelectOptions);
          }
          return schema;
        });

        return { ok: true, schemas };
      }
    },

    getInstructorSchema: {
      handler() {
        return { ok: true, schema: instructorSchema };
      },
    },

    getSectionCreateSchema: {
      handler() {
        return { ok: true, schema: sectionCreateSchema };
      },
    },

    getSectionEditSchema: {
      params: {
        sectionId: 'string',
      },
      async handler(ctx) {
        const sectionId = +ctx.params.sectionId;

        const schema = await this.broker.call('dbSchemas.listSchemas')
          .then((res) => res.schemas.map(({ id, type, json }) => ({ id, type, json })))
          .then((schemas) => schemas.find((sectionSchema) => sectionSchema.id === sectionId))
          .then((schemaData) => sectionCreateSchema.map((field) => ({
            ...field,
            value: schemaData[field.name],
          })));
        return { ok: true, schema };
      },
    },

    createSectionSchema: {
      handler(ctx) {
        const { json, type } = ctx.params;
        const { name } = json;

        if (!this.validateSectionSchema(json)) {
          return JSON.stringify({ ok: false }, null, 2);
        }

        return this.broker.call('dbSchemas.createSchema', { name, json, type })
          .then((res) => JSON.stringify(res, null, 2));
      },
    },

    editSectionSchema: {
      handler(ctx) {
        const { id, json, type } = ctx.params;
        const { name } = json;

        if (!this.validateSectionSchema(json)) {
          return JSON.stringify({ ok: false }, null, 2);
        }

        return this.broker.call('dbSchemas.editSchema', {
          id, name, json, type
        })
          .then((res) => JSON.stringify(res, null, 2));
      },
    },
  },

  methods: {
    addOptions: {
      handler(schema, options) {
        return {
          ...schema,
          fieldsets: schema.fieldsets.map((fieldset) => ({
            ...fieldset,
            options,
          }))
        };
      },
    },

    validateSectionSchema: {
      handler(json) {
        const {
          name, title, fields, fieldsets
        } = json;
        const isValid = name && title && fields && fieldsets;

        return isValid;
      },
    },
  },
});
