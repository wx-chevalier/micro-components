const path = require('path');
const { merge } = require('webpack-merge');

const umdConfig = require('../../../../scripts/webpack/webpack.config').umdConfig;

const rootPath = process.cwd();

module.exports = merge(umdConfig, {
  output: {
    library: 'mmts',
  },
  entry: {
    index: path.resolve(rootPath, './src/index.tsx'),
  },
});
