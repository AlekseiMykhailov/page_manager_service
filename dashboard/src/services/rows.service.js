const mockCreatedRows = [
  {
    id: 'row-1',
    webPageId: 2,
    order: 1,
    meta: {
      title: 'Row with image',
      templateHbs: 'withImage',
    },
    fields: [
      {
        name: 'title',
        type: 'text',
        value: 'Software Quality Assurance',
      },
      {
        name: 'description',
        type: 'text',
        value: 'An intensive practical course to prepare you for a successful QA career in just 4 weeks',
      },
      {
        name: 'backgroundImageURL',
        type: 'url',
        value: 'https://uploads-ssl.webflow.com/5c8ff8ef21fa8e172cd8a465/5d2715893854966a256dae76_Group%202.jpg',
      },
    ],
  },
  {
    id: 'row-2',
    webPageId: 3,
    order: 1,
    meta: {
      title: 'Row with image',
      templateHbs: 'withImage',
    },
    fields: [
      {
        name: 'title',
        type: 'text',
        value: 'Learn DevOps',
      },
      {
        name: 'description',
        type: 'text',
        value: 'An intensive practical course to prepare you for a successful DevOps career in just 12 weeks.',
      },
      {
        name: 'backgroundImageURL',
        type: 'url',
        value: 'https://uploads-ssl.webflow.com/5c8ff8ef21fa8e172cd8a465/5e538231eba259546b4261f4_Group%202.jpg',
      },
    ],
  },
  {
    id: 'row-3',
    webPageId: 2,
    order: 2,
    meta: {
      title: 'Row with bricks',
      templateHbs: 'bricks',
    },
    fields: [
      {
        name: 'title',
        type: 'text',
        value: 'How it Works',
      },
      {
        name: 'edge-1',
        type: 'text',
        value: '4-week intensive online training will help you develop technical and communication skills for a successful career in QA.'
      },
      {
        name: 'edge-2',
        type: 'text',
        value: 'Live classes are weekly Sunday to Thursday 9:30–11:30 PM Eastern. After each lesson students get handouts and recording.'
      },
      {
        name: 'edge-3',
        type: 'text',
        value: '1:1 support and mentoring. Students can ask questions during the lessons or after them. Even after the course is over.'
      },
      {
        name: 'edge-4',
        type: 'text',
        value: 'We will make your resume and post it on job sites with proper keywords so you could get tons of calls from recruiters.'
      },
      {
        name: 'edge-5',
        type: 'text',
        value: 'You will learn how to search for a job effectively, answer interview questions and significantly increase chances of getting hired.'
      },
      {
        name: 'edge-6',
        type: 'text',
        value: 'Study first, pay us later. No student loans, no debt, and you won\'t pay a tuition until you land a job making at least $50k a year.'
      }
    ],
  },
  {
    id: 'row-4',
    webPageId: 3,
    order: 2,
    meta: {
      title: 'Row with bricks',
      templateHbs: 'bricks',
    },
    fields: [
      {
        name: 'title',
        type: 'text',
        value: 'How it Works',
      },
      {
        name: 'edge-1',
        type: 'text',
        value: '12-week intensive online training after which you can start looking for a mid-level job.',
      },
      {
        name: 'edge-2',
        type: 'text',
        value: 'Live online classes with homework for daily practice. 1:1 support and mentoring, even after the course is over.',
      },
      {
        name: 'edge-3',
        type: 'text',
        value: 'You will learn how to answer interview questions and how to pass job interview coding and other tests.',
      },
      {
        name: 'edge-4',
        type: 'text',
        value: 'We will make your resume of experienced Engineer, so you can aim at $115K+ salary. We provide internships and references.',
      },
      {
        name: 'edge-5',
        type: 'text',
        value: 'The first 2 lessons are FREE. You won`t pay full tuition until you land a job. If you don`t get a job in IT, you won`t owe us anything.',
      },
      {
        name: 'edge-6',
        type: 'text',
        value: 'Pay $99 registration fee and 17% of your salary over 24 months (if you don`t get a job, the course is FREE) OR $999 fee and 10% of the salary over 18 mo.',
      }
    ],
  }
];

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

  getRowById(rowId) {
    return this.rows.find((row) => row.id === rowId);
  }

  getRowsByPageId(webPageId) {
    return this.rows.filter((row) => row.webPageId === webPageId);
  }

  update(id, order, data) {
    this.rows = this.rows.map((row) => {
      if (row.id === id) {
        return { ...data };
      }

      return row;
    });

    return this.rows.find((row) => row.id === id);
  }

  delete(id) {
    const { length } = this.rows;
    this.rows = [...this.rows].filter((row) => row.id !== id);

    return (length !== this.rows.length) ? 'Success' : 'Fail';
  }
}

const rowsStore = new RowsStore(mockCreatedRows);

module.exports = ({
  name: 'rows',
  actions: {
    createRow: {
      handler(ctx) {
        return this.broker.call('schemas.constructRow', ctx.params)
          .then((row) => {
            rowsStore.add(row);
            return row.id;
          })
          .then((rowId) => rowsStore.getRowById(rowId))
          .then((row) => JSON.stringify({ ok: true, rowId: row.id }));
      },
    },

    getRowsForPage: {
      handler(ctx) {
        return rowsStore.getRowsByPageId(ctx.params.id);
      },
    },

    getRows: {
      handler() {
        return rowsStore.get();
      },
    },

    updateRow: {
      params: {
        rowId: 'string',
        order: 'number',
      },
      handler(ctx) {
        const data = {...ctx.params};
        const { rowId, order } = ctx.params;

        rowsStore.update(rowId, +order, data);

        const updatedRow = rowsStore.getRowById(rowId);

        this.logger.info('UPDATED ROW: ', updatedRow);

        return this.broker.call('webPages.getWebPageById', { id: updatedRow.webPageId })
          .then((webPage) => {
            this.logger.info('UPDATE ROW - GET WEBPAGE: ', webPage);
            return this.broker.call('dashboard.editWebPage', webPage);
          });
      },
    },

    deleteRow: {
      params: { id: 'string' },
      handler(ctx) {
        const { id } = ctx.params;

        rowsStore.delete(id);
        this.logger.info('DELETED ROW ID: ', id);

        return JSON.stringify({ ok: true, id });
      },
    },
  },
});
