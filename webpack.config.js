// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

module.exports = {
  optimization: {
    minimize: false,
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
  },
  devtool: 'source-map',
  entry: {
    'auth0chrome.min': './index.ts',
  },
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
    ],
  },
  plugins: [
  ],
  output: {
    path: path.resolve(__dirname, './dist'),
    library: 'Auth0Chrome',
    libraryTarget: 'umd',
    libraryExport: 'default',
    filename: '[name].js'
  },
};
