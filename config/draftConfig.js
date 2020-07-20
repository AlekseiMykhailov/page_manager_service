const { FIELD_TYPES } = require('./constants');
const rowsConfig = require('./rows');

const draftConfig = {
  name: 'Add Draft',
  dependencies: [],
  fields: {
    domain: {
      type: FIELD_TYPES.select,
      name: 'domain',
      label: 'Domain',
      require: true,
      child: [
        'localhost:4000',
        'localhost:5000',
      ]
    },
    slug: {
      type: FIELD_TYPES.text,
      name: 'slug',
      label: 'Slug',
      placeholder: 'Slug of the block',
      require: true,
    },
    title: {
      type: FIELD_TYPES.text,
      name: 'title',
      label: 'Title',
      placeholder: 'Title of the block',
      require: false,
    },
    descr: {
      type: FIELD_TYPES.text,
      name: 'descr',
      label: 'Description',
      placeholder: 'Description of the block',
      require: false,
    },
  },
  rows: rowsConfig,
};

module.exports = {
  draftConfig,
};
