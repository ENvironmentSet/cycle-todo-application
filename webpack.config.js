const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const { HotModuleReplacementPlugin } = require('webpack');

module.exports = {
  mode: 'development',
  entry: resolve('src', 'app'),
  output: {
    filename: 'bundle.js',
    path: resolve('dist'),
  },
  devtool: 'inline-source-map',
  devServer: {
    hot: true,
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({
      template: resolve('index.html'),
    }),
    new HotModuleReplacementPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          { loader: 'style-loader' },
          {
            loader: 'css-loader',
            options: {
              modules: false,
            }
          }
        ]
      }
    ]
  },
  resolve: {
    alias: {
      '^': resolve('src'),
    }
  }
};
