/* eslint-disable max-classes-per-file */
const { v4 } = require('uuid');

class FieldSchema {
  constructor(name, label, type, order) {
    this.name = name;
    this.label = label;
    this.type = type;
    this.order = order;
  }
}

class WebPage {
  constructor(slug, title, description, isHomePage) {
    this.id = v4();
    this.slug = slug;
    this.isHomePage = isHomePage;
    this.title = title;
    this.description = description;
  }
}

// class SectionMeta {
//   constructor(title, templateHbs) {
//     this.title = title;
//     this.templateHbs = templateHbs;
//   }
// }

// class Section {
//   constructor(id, webPageId, order, schema, dependencies, fields) {
//     this.id = id;
//     this.webPageId = webPageId;
//     this.order = order;
//     this.meta = schema;
//     this.dependencies = dependencies;
//     this.fields = fields;
//   }
// }

// class SectionSchemasStore {
//   constructor(sectionSchemas) {
//     this.schemas = sectionSchemas;
//   }

//   add(schema) {
//     this.schemas = [...this.schemas, schema];
//   }

//   getList() {
//     return this.schemas;
//   }
// }

const webPageSchema = {
  title: new FieldSchema('title', 'Title', 'text', 10),
  domain: new FieldSchema('domain', 'Domain', 'select', 20),
  slug: new FieldSchema('slug', 'Slug', 'text', 30),
  description: new FieldSchema('description', 'Description', 'text', 50),
};

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
        itemsQty: 1,
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
        description: 'Title of the benefits block',
        value: '',
        order: 100,
      },
    ],
    fieldsets: [
      {
        title: 'Benefits',
        name: 'benefits',
        itemsQty: 1,
        maxItemsQty: 6,
        itemFields: [
          {
            name: 'benefitItem.title',
            type: 'text',
            title: 'Title',
            description: 'Benefit`s title',
            value: '',
            order: 100,
          },
          {
            name: 'benefitItem.description',
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
];

module.exports = ({
  name: 'schemas',
  actions: {

    getWebPageSchema: {
      handler() {
        return JSON.stringify({ ok: true, schema: webPageSchema }, null, 2);
      },
    },

    getSectionSchemas: {
      handler() {
        return JSON.stringify({ ok: true, schemas: sectionsSchemas }, null, 2);
      }
    },

    constructWebPage: {
      params: {
        slug: 'string',
        title: 'string',
        description: 'string',
      },
      handler(ctx) {
        const {
          slug, title, description
        } = ctx.params;

        return new WebPage(slug, title, description);
      },
    },

    // constructSection: {
    //   params: {
    //     webPageId: 'number',
    //     order: 'number',
    //   },
    //   handler(ctx) {
    //     const {
    //       name, webPageId, order, dependencies, fields
    //     } = ctx.params;

    //     return new Section(webPageId, +order, dependencies, fields);
    //   },
    // },
  },
});
