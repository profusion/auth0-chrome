const merge = require('webpack-merge');
const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
var webpack = require("webpack");

const common = {
  context: __dirname,
  output: {
    path: path.resolve(__dirname, './dist'),
    library: 'Auth0Chrome',
    libraryTarget: 'umd',
    libraryExport: 'default',
    filename: '[name].js'
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  }
}

const prod = {
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        test: /\.js(\?.*)?$/i,
      }),
    ],
  },
  entry: {
    'auth0chrome.min': './index.js'
  },

  mode: 'production',

  devtool: 'source-map'
}

const dev = {

  entry: {
    'auth0chrome': './index.js'
  },

  mode: 'development',

  devtool: 'source-map'
}

module.exports = [ merge(common, prod), merge(common, dev) ];
