const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin')

module.exports = {
  entry: './index.js',
  output: {
    path: path.resolve(__dirname, 'docs'),
    filename: 'cleanview.js',
    library: 'cleanview'
  },
  mode: 'production',
  plugins: [
    new TerserPlugin({
      parallel: true,
      terserOptions: {
        ecma: 6
      }
    })
  ],
  module: {
  },
  stats: {
    colors: true
  }
};
