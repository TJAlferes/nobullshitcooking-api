const path = require('path');
const webpackNodeExternals = require('webpack-node-externals');

module.exports = {
  mode: 'production',
  target: 'node',
  externals: [webpackNodeExternals()],
  //externals: [webpackNodeExternals({whitelist: ['redis-parser', 'engine.io']})],
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'build')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  }
};