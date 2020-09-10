const { layout } = require('./layout');
const { cssStyles } = require('./cssStyles');
const { jsScripts } = require('./jsScripts');
const {
  header, benefits, reviews, instructors
} = require('./sections');

const template = {
  layout,
  cssStyles,
  jsScripts,
  header,
  benefits,
  reviews,
  instructors,
};

module.exports = template;
