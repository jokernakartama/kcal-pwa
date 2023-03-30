const path = require('path')
const merge = require('webpack-merge').default
const CopyPlugin = require('copy-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const WebpackPwaManifest = require('webpack-pwa-manifest')
const WorkboxPlugin = require('workbox-webpack-plugin')
const config = require('./webpack.common')
const { rootDir } = require('./constants')

module.exports = merge(config, {
  devtool: false,
  mode: 'production',

  plugins: [
    new CleanWebpackPlugin(),
    new CopyPlugin({
      patterns: [
        { from: 'static', to: '' }
      ]
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[chunkhash].css'
    }),
    new WebpackPwaManifest({
      publicPath: '.',
      start_url: 'index.html?standalone=true',
      name: 'Moon Pooper',
      short_name: 'Moon Pooper',
      description: 'An app that helps you keep tracking your daily nutrients.',
      background_color: '#31363B',
      display: 'standalone',
      theme_color: '#31363B',
      orientation: 'portrait',
      icons: [
        {
          src: path.join(rootDir, 'src/icons/icon.png'),
          sizes: [96, 128, 192, 256, 384, 512, 1024]
        },
        {
          src: path.join(rootDir, 'src/icons/icon_maskable.png'),
          size: [96, 128, 192, 256, 384, 512, 1024],
          purpose: 'maskable'
        }
      ]
    }),
    new WorkboxPlugin.GenerateSW({
      // these options encourage the ServiceWorkers to get in there fast
      // and not allow any straggling "old" SWs to hang around
      clientsClaim: true,
      skipWaiting: true

    })
  ],

  optimization: {
    splitChunks: {
      cacheGroups: {
        polyfills: {
          test: /[\\/]node_modules[\\/](core-js|regenerator-runtime)[\\/]/,
          name: 'polyfills',
          chunks: 'all'
        },
        vendors: {
          test: /[\\/]node_modules[\\/](?!(core-js|regenerator-runtime)[\\/])/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    },
    emitOnErrors: false,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          output: {
            comments: false
          }
        },
        extractComments: false
      }),
      new CssMinimizerPlugin()
    ]
  }
})
