import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import path from 'path';

module.exports = {
  entry: './dist/src/index.ts',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js'
  },
  target: 'node',
  plugins: [
    new CleanWebpackPlugin()
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
  }
};
