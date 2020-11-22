const webpack = require('webpack');
module.exports = {
  entry: {
    main: './src/index.js',
  },
  output: {
    path: './build/',
    filename: '[name].js',
  },
};