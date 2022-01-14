const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ESLintPlugin = require('eslint-webpack-plugin')
const loaders = require('./loaders')
const { rootDir, buildPath } = require('./constants')

module.exports = {
  entry: {
    main: path.join(rootDir, 'src/index.tsx')
  },
  output: {
    filename: process.env.NODE_ENV === 'development'
      ? '[name].js'
      : '[name].[contenthash].js',
    path: buildPath
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx', '.jsx'],
    modules: [path.resolve(rootDir, 'node_modules')]

  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: loaders(['css', 'postcss'])
      },
      {
        test: /\.ts(x)?$/,
        use: [
          'babel-loader',
          'ts-loader'
        ],
        exclude: /node_modules/
      },
      {
        test: /\.js(x)?$/,
        loader: 'babel-loader'
      },
      {
        test: /\.(png|jpe?g|gif|webp)(\?.*)?$/,
        loader: 'file-loader',
        options: {
          limit: 4096,
          fallback: {
            loader: 'file-loader',
            options: {
              name: 'img/[name].[hash:8].[ext]'
            }
          }
        }
      }
    ]
  },

  plugins: [
    new ESLintPlugin({
      extensions: ['.js', '.ts']
    }),
    new webpack.DefinePlugin(
      {
        'process.env': {
          BASE_URL: '"./"'
        }
      }
    ),
    new HtmlWebpackPlugin({
      template: path.join(rootDir, 'src/index.html'),
      publicPath: './',
      filename: path.join(rootDir, 'dist/index.html')
    })
  ]
}
