//const { IgnorePlugin } = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const path = require('path');

module.exports = {
  entry: './src/index.ts',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js'
  },
  mode: 'production',
  target: 'node',
  plugins: [
    new CleanWebpackPlugin(),
    //new IgnorePlugin({
    //  resourceRegExp: /\.(env)$/
    //})
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              configFile: './tsconfig.prod.json'
            }
          }
        ]
      }
    ]
  },
  externals: {
    bufferutil: "bufferutil",
    "utf-8-validate": "utf-8-validate",
  }
};
