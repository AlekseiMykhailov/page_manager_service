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

const rowsStore = new RowsStore();

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
