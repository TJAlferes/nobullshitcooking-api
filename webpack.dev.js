const path = require('path');
const webpackNodeExternals = require('webpack-node-externals');

module.exports = {
  mode: 'development',
  target: 'node',
  externals: [webpackNodeExternals({whitelist: ['redis-parser', 'engine.io']})],
  entry: './src/index.ts',  // .js ?
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  devServer: {
    host: '0.0.0.0',
    public: '0.0.0.0:3003',
    port: 3003,
    stats: {
      warnings: false
    }
  },
  watchOptions: {
    aggregateTimeout: 300,
    poll: 1000
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.ts(x?)$/,
        exclude: /node_modules/,
        loader: "ts-loader"
      },
    ]
  }
};