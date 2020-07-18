const FIELD_TYPE = require('../../constants');
const BRICKS_TYPE = {
  simple: 'simple',
  person: 'person',
};

const brickSimple = {
  type: BRICKS_TYPE.simple,
  name: 'Simple Bricks',
  fieldSetName: 'simple-bricks',
  fields: {
    title: {
      type: FIELD_TYPE.text,
      name: 'title',
      label: 'Title',
      placeholder: 'Title of the block',
      require: false,
    },
    content: {
      type: FIELD_TYPE.text,
      name: 'content',
      label: 'Content',
      placeholder: 'Content of the block',
      require: true,
    },
  },
};

const brickPerson = {
  type: BRICKS_TYPE.person,
  name: 'Person Bricks',
  fieldSetName: 'person-bricks',
  fields: {
    personName: {
      type: FIELD_TYPE.text,
      name: 'person-name',
      label: 'First and Last Name',
      placeholder: 'First and Last Name of the Person',
      require: true,
    },
    content: {
      type: FIELD_TYPE.text,
      name: 'content',
      label: 'Brief personality description',
      placeholder: 'Brief personality description',
      require: true,
    },
    photo: {
      type: FIELD_TYPE.file,
      name: 'photo',
      label: 'Photo',
      placeholder: 'Personality photo',
      require: true,
    },
    linkedIn: {
      type: FIELD_TYPE.url,
      name: 'linked-in',
      label: 'LinkedIn Profile Link',
      placeholder: 'LinkedIn Profile Link',
      require: false,
    },
  },
};

const bricksConfig = {
  name: 'Row with Bricks',
  dependencies: [],
  fields: {
    title: {
      type: FIELD_TYPE.text,
      name: 'row-title',
      label: 'Title',
      placeholder: 'Title of this row',
      require: false,
    },
    subTitle: {
      type: FIELD_TYPE.text,
      name: 'row-subtitle',
      label: 'Subtitle',
      placeholder: 'Subtitle title of this row',
      require: false,
    },
    subContent: {
      type: FIELD_TYPE.text,
      name: 'row-subcontent',
      label: 'Content after the row',
      placeholder: 'Content after the row',
      require: false,
    },
  },
  blocks: [brickSimple, brickPerson],
};



module.exports = {
  bricksConfig,
  BRICKS_TYPE,
};
