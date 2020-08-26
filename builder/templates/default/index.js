const { layout } = require('./layout');
const { cssStyles } = require('./cssStyles');
const { jsScripts } = require('./jsScripts');
const { rowBricks, rowWithImage } = require('./sections');

const template = {
  layout,
  cssStyles,
  jsScripts,
  rowBricks,
  rowWithImage,
};

module.exports = template;
