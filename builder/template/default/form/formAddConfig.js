const FIELD_TYPE = require('../constants');

const formAddConfig = {
  name: 'Add Draft',
  dependencies: [],
  fields: {
    domain: {
      type: FIELD_TYPE.select,
      name: 'domain',
      label: 'Domain',
      require: true,
      child: [
        'localhost:4000',
        'localhost:5000',
      ]
    },
    slug: {
      type: FIELD_TYPE.text,
      name: 'slug',
      label: 'Slug',
      placeholder: 'Slug of the block',
      require: true,
    },
    title: {
      type: FIELD_TYPE.text,
      name: 'title',
      label: 'Title',
      placeholder: 'Title of the block',
      require: false,
    },
    descr: {
      type: FIELD_TYPE.text,
      name: 'descr',
      label: 'Description',
      placeholder: 'Description of the block',
      require: false,
    },
  },
};

module.exports = {
  formAddConfig,
};
