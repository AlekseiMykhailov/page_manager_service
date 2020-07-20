const mockCreatedRow = {
  meta: {
    title: 'Block with image',
    templateHbs: 'withImage',
  },
  webPageId: 1,
  order: 1,
  fields: [
    {
      name: 'title-1',
      type: 'text',
      value: 'Software Quality Assurance',
    },
    {
      name: 'description-1',
      type: 'text',
      value: 'An intensive practical course to prepare you for a successful QA career in just 4 weeks',
    },
    {
      name: 'image-1',
      type: 'file',
      value: 'https://uploads-ssl.webflow.com/5c8ff8ef21fa8e172cd8a465/5d2715893854966a256dae76_Group%202.jpg',
    },
  ],
};

class Row {
  constructor(webPageId, order, meta, fields) {
    this.id = new Date.now();
    this.webPageId = webPageId;
    this.order = order;
    this.meta = {...meta};
    this.fields = [...fields];
  }
}

class RowMeta {
  constructor(title, templateHbs) {
    this.title = title;
    this.templateHbs = templateHbs;
  }
}

class RowsStore {
  constructor(rows) {
    this.rows = rows;
  }

  add(draft) {
    this.rows = [...this.rows, draft];

    return this.rows[this.rows.length - 1];
  }

  get() {
    return this.rows;
  }
}

const rowsStore = new RowsStore(mockCreatedRow);

module.exports = ({
  name: 'rows',
  actions: {
    createRow(ctx) {
      const { title, templateHbs, webPageId, order, fields } = ctx.params;
      const rowMeta = new RowMeta(title, templateHbs);
      const row = new Row(webPageId, order, rowMeta, fields);

      rowsStore.add(row);
    },

    getRows() {
      return rowsStore.get();
    },
  },
});
