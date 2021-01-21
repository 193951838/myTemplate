const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const baseConfig = require('./webpack.config.base');

module.exports = {
  ...baseConfig,
  mode: 'production', //  当mode为production时，默认devtool: 'none',
  plugins: [...baseConfig.plugins, new CleanWebpackPlugin()],
};
