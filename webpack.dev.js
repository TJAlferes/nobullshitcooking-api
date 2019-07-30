const path = require('path');
const webpackNodeExternals = require('webpack-node-externals');

module.exports = {
  mode: 'development',
  devServer: {
    host: '0.0.0.0',
    public: '0.0.0.0:8080'
  },
  target: 'node',
  externals: [webpackNodeExternals()],
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  },
  watchOptions: {
    aggregateTimeout: 300,
    poll: 1000,
    port: 3003
  }
};