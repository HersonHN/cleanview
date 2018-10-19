const path = require('path');
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
  entry: './index.js',
  output: {
    path: path.resolve(__dirname, 'docs'),
    filename: 'cleanview.js',
    library: 'cleanview'
  },
  mode: 'production',
  plugins: [
    new UglifyJsPlugin()
  ],
  module: {
  },
  stats: {
    colors: true
  }
};
