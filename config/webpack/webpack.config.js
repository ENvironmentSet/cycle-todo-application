const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const { HotModuleReplacementPlugin } = require('webpack');

const { resolve } = require('path');

const babelConfig = require(resolve('config/babel/babel.config.js'));

module.exports = { //@TODO: Add production mode config
  mode: 'development',
  entry: resolve('src', 'app'),
  output: {
    filename: 'bundle.js',
    path: resolve('dist'),
  },
  devtool: 'inline-source-map',
  devServer: {
    hot: true,
    open: true,
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
          },
        ]
      },
      {
        test: /\.m?jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: babelConfig,
        }
      },
    ]
  },
  resolve: {
    alias: {
      '^': resolve('src'),
    },
    extensions: ['.mjs', '.js', '.jsx'],
  },
};
