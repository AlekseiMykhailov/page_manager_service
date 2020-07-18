const { bricksConfig } = require('./bricks/config');
const { withImageConfig } = require('./withImage/config');

const rowsConfig = {
  rows: [bricksConfig, withImageConfig]
};

module.exports = { rowsConfig };
