/* eslint-disable import/prefer-default-export */
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

class RowMeta {
  constructor(title, templateHbs) {
    this.title = title;
    this.templateHbs = templateHbs;
  }
}

class Row {
  constructor(id, webPageId, order, schema, rowFields) {
    this.id = id;
    this.webPageId = webPageId;
    this.order = order;
    this.meta = { ...schema };
    this.fields = [...rowFields];
  }
}

const webPageSchema = {
  domain: new FieldSchema('domain', 'Domain', 'select', 10),
  slug: new FieldSchema('slug', 'Slug', 'text', 20),
  isHomePage: new FieldSchema('isHomePage', 'It`s Home Page', 'checkbox', 30),
  title: new FieldSchema('title', 'Title', 'text', 40),
  description: new FieldSchema('description', 'Description', 'text', 50),
};

const rowsSchemas = [
  {
    id: '1',
    webPageId: 'number',
    order: 'number',
    dependencies: ['withImage.css'],
    meta: {
      title: 'Row with image',
      templateHbs: 'withImage',
    },
    fields: [
      {
        name: 'title',
        label: 'Title',
        type: 'text',
        order: 1,
      },
      {
        name: 'description',
        label: 'Description',
        type: 'text',
        order: 2,
      },
      {
        name: 'backgroundImageURL',
        label: 'Background Image URL',
        type: 'url',
        order: 3,
      },
    ],
  },
  {
    id: '2',
    webPageId: 'number',
    order: 'number',
    dependencies: ['bricks.css'],
    meta: {
      title: 'Row with bricks',
      templateHbs: 'bricks',
    },
    fields: [
      {
        name: 'title',
        label: 'Title',
        type: 'text',
        order: 1,
      },
      {
        name: 'brick',
        label: 'Brick',
        type: 'text',
        order: 10,
        clonable: true,
      },
    ],
  },
];

class RowSchemasStore {
  constructor(rowSchemas) {
    this.schemas = rowSchemas;
  }

  add(schema) {
    this.schemas = [...this.schemas, schema];
  }

  getList() {
    return this.schemas;
  }
}

const rowSchemasStore = new RowSchemasStore(rowsSchemas);

module.exports = ({
  name: 'schemas',
  actions: {

    getWebPageSchema: {
      handler() {
        return JSON.stringify({ ok: true, schema: webPageSchema }, null, 2);
      },
    },

    getRowSchemas: {
      handler() {
        return { ok: true, schemas: rowSchemasStore.getList() };
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

    constructRow: {
      params: {
        webPageId: 'number',
        order: 'number',
      },
      handler(ctx) {
        const {
          meta, webPageId, order, fields
        } = ctx.params;
        const { title, templateHbs } = meta;
        const rowMeta = new RowMeta(title, templateHbs);
        const id = v4();

        return new Row(id, webPageId, +order, rowMeta, fields);
      },
    },
  },
});
