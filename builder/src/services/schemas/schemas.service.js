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
];

const sectionsSchemas = [
  {
    name: 'header',
    title: 'Header Section',
    dependencies: ['header.css', 'button.css'],
    webPageId: 'number',
    order: 'number',
    fields: [
      {
        name: 'title',
        type: 'text',
        title: 'Title',
        description: 'Catchy a course title',
        value: '',
        order: 100,
      },
      {
        name: 'description',
        type: 'text',
        title: 'Description',
        description: 'Short description of a course',
        value: '',
        order: 110,
      },
      {
        name: 'backgroundImage',
        type: 'url',
        title: 'Background',
        description: 'Background Image',
        value: '',
        order: 120,
      },
    ],
    fieldsets: [
      {
        title: 'Call To Action',
        name: 'ctaHeader',
        maxItemsQty: 1,
        itemFields: [
          {
            name: 'ctaHeader.text',
            type: 'text',
            title: 'Text',
            description: 'CTA on button',
            value: '',
            order: 100,
          },
          {
            name: 'ctaHeader.url',
            type: 'url',
            title: 'URL',
            description: 'URL',
            value: '',
            order: 110,
          },
        ],
      }
    ],
  },
  {
    name: 'benefits',
    title: 'Section With Benefits',
    dependencies: ['benefits.css'],
    webPageId: 'number',
    order: 'number',
    fields: [
      {
        name: 'title',
        type: 'text',
        title: 'Title',
        description: 'Title of the benefits section',
        value: '',
        order: 100,
      },
    ],
    fieldsets: [
      {
        title: 'Benefits',
        name: 'benefits',
        maxItemsQty: 6,
        itemFields: [
          {
            name: 'benefits.title',
            type: 'text',
            title: 'Title',
            description: 'Benefit`s title',
            value: '',
            order: 100,
          },
          {
            name: 'benefits.description',
            type: 'text',
            title: 'Description',
            description: 'Description of the benefit',
            value: '',
            order: 110,
          },
        ],
      }
    ],
  },
  {
    name: 'reviews',
    title: 'Text Reviews',
    dependencies: ['reviews.css'],
    webPageId: 'number',
    order: 'number',
    fields: [],
    fieldsets: [
      {
        title: '',
        name: 'reviews',
        maxItemsQty: 10,
        itemFields: [
          {
            name: 'reviews.reviewer',
            type: 'text',
            title: 'Reviewer',
            description: 'Reviewer Name',
            value: '',
            order: 100,
          },
          {
            name: 'reviews.authorPhoto',
            type: 'text',
            title: 'Photo',
            description: 'Photo',
            value: '',
            order: 200,
          },
          {
            name: 'reviews.companyName',
            type: 'text',
            title: 'Company',
            description: 'The name of the company where the reviewer works',
            value: '',
            order: 300,
          },
          {
            name: 'reviews.companyLogo',
            type: 'text',
            title: 'Company Logo',
            description: 'The logo of the company',
            value: '',
            order: 400,
          },
          {
            name: 'reviews.text',
            type: 'textarea',
            title: 'Review Text',
            description: 'Review Text',
            value: '',
            order: 600,
          },
        ],
      },
    ],
  },
  {
    name: 'instructors',
    title: 'Instructors Section',
    dependencies: ['instructors.css'],
    webPageId: 'number',
    order: 'number',
    fields: [
      {
        name: 'title',
        type: 'text',
        title: 'Title',
        description: 'Title of the instructors section',
        value: '',
        order: 100,
      },
      {
        name: 'description',
        type: 'text',
        title: 'Description',
        description: 'Description of the instructors section',
        value: '',
        order: 200,
      },
    ],
    fieldsets: [
      {
        title: 'Instructors',
        name: 'instructors',
        maxItemsQty: 6,
        itemFields: [
          {
            name: 'instructors.person',
            type: 'select',
            title: 'Instructor',
            description: 'Instructor',
            value: '',
            order: 100,
          },
        ],
      },
    ],
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
      handler(ctx) {
        const { name } = ctx.params;

        return { ok: true, schemas: sectionsSchemas.filter((schema) => schema.name === name) };
      }
    },

    listSectionSchemas: {
      async handler() {
        const instructorSelectOptions = await this.broker.call('instructors.listOptions');
        const schemas = sectionsSchemas.map((schema) => {
          if (schema.name === 'instructors') {
            return {
              ...schema,
              fieldsets: schema.fieldsets.map((fieldset) => ({
                ...fieldset,
                options: instructorSelectOptions,
              }))
            };
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
  },
});
