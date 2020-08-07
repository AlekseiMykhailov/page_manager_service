/* eslint-disable import/prefer-default-export */
/* eslint-disable max-classes-per-file */
const { v4 } = require('uuid');

class FieldSchema {
  constructor(name, type) {
    this.name = name;
    this.type = type;
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
  domain: new FieldSchema('domain', 'select'),
  slug: new FieldSchema('slug', 'text'),
  isHomePage: new FieldSchema('isHomePage', 'checkbox'),
  title: new FieldSchema('title', 'text'),
  description: new FieldSchema('description', 'text'),
};

const mockRowsSchemas = [
  {
    id: '1',
    webPageId: 'number',
    order: 'number',
    meta: {
      title: 'Row with image',
      templateHbs: 'withImage',
    },
    fields: [
      {
        name: 'title',
        type: 'text',
      },
      {
        name: 'description',
        type: 'text',
      },
      {
        name: 'backgroundImageURL',
        type: 'url',
      },
    ],
  },
  {
    id: '2',
    webPageId: 'number',
    order: 'number',
    meta: {
      title: 'Row with bricks',
      templateHbs: 'bricks',
    },
    fields: [
      {
        name: 'title',
        type: 'text',
      },
      {
        name: 'edge-1',
        type: 'text',
      },
      {
        name: 'edge-2',
        type: 'text',
      },
      {
        name: 'edge-3',
        type: 'text',
      },
      {
        name: 'edge-4',
        type: 'text',
      },
      {
        name: 'edge-5',
        type: 'text',
      },
      {
        name: 'edge-6',
        type: 'text',
      },
    ],
  },
];

class RowFieldSchema {
  constructor(name, type) {
    this.name = name;
    this.type = type;
  }
}

class RowSchema {
  constructor(title, templateHbs, fields) {
    this.title = title;
    this.templateHbs = templateHbs;
    this.fields = fields;
  }
}

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

const rowSchemasStore = new RowSchemasStore(mockRowsSchemas);

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
