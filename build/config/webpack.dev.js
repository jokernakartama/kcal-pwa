const { merge } = require('webpack-merge')
const config = require('./webpack.common')
const { buildPath } = require('./constants')

module.exports = merge(config, {
  devtool: 'cheap-module-source-map',
  mode: 'development',
  devServer: {
    port: 5000,
    client: {
      overlay: true
    },
    static: {
      directory: buildPath,
      publicPath: '/',
      serveIndex: false
    },
    // contentBase: buildPath,
    historyApiFallback: true,
    hot: true,
    // quiet: false,
    // stats: 'minimal',
    // injectClient: true,
    // inline: true,
    compress: true,
    watchFiles: [ 'src/**/*.(ts|js|svg|html)' ]
  }
})
