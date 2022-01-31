const { merge } = require('webpack-merge')
const config = require('./webpack.common')

module.exports = merge(config, {
  devtool: 'cheap-module-source-map',
  mode: 'development',
  devServer: {
    port: 5000,
    client: {
      overlay: true
    },
    static: ['static'],
    historyApiFallback: true,
    hot: true,
    compress: true,
    watchFiles: ['src/**/*.(ts|js|svg|html)']
  }
})
