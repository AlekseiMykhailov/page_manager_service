const { bricksConfig } = require('./configRowBricks');
const { withImageConfig } = require('./configRowWithImage');

const rowsConfig = {
  rows: [bricksConfig, withImageConfig]
};

module.exports = { rowsConfig };
