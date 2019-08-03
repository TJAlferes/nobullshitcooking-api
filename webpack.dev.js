const path = require('path');
const webpackNodeExternals = require('webpack-node-externals');

module.exports = {
  mode: 'development',
  devServer: {
    host: '0.0.0.0',
    public: '0.0.0.0:3003',
    port: 3003,
    stats: {
      warnings: false
    }
  },
  target: 'node',
  externals: [webpackNodeExternals({whitelist: ['redis-parser', 'engine.io']})],
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
    poll: 1000
  }
};