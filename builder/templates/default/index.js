const { layout } = require('./layout');
const { cssStyles } = require('./cssStyles');
const { jsScripts } = require('./jsScripts');
const {
  applyForm, benefits, header, instructors, reviews
} = require('./sections');

const template = {
  layout,
  cssStyles,
  jsScripts,
  applyForm,
  benefits,
  header,
  instructors,
  reviews,
};

module.exports = template;
