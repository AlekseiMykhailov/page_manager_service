const FIELD_TYPE = require('../../constants');

const withImageConfig = {
  name: 'Row with Image',
  dependencies: [],
  fields: {
    title: {
      type: FIELD_TYPE.text,
      require: true,
    },
    subTitle: {
      type: FIELD_TYPE.text,
      require: false,
    },
    content: {
      type: FIELD_TYPE.text,
      require: true,
    },
    image: {
      type: FIELD_TYPE.file,
      require: true,
    },
  },
};

module.exports = { withImageConfig };
