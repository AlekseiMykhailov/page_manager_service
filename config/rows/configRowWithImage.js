const { FIELD_TYPES } = require('../constants');

const withImageConfig = {
  name: 'Row with Image',
  fieldSetName: 'with-image',
  dependencies: [],
  fields: {
    title: {
      type: FIELD_TYPES.text,
      require: true,
    },
    subTitle: {
      type: FIELD_TYPES.text,
      require: false,
    },
    content: {
      type: FIELD_TYPES.text,
      require: true,
    },
    image: {
      type: FIELD_TYPES.file,
      require: true,
    },
  },
};

module.exports = { withImageConfig };
