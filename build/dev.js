process.env.NODE_ENV = 'development'

const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const config = require('./config/webpack.dev')
const compiler = webpack(config)
const server = new WebpackDevServer(config.devServer, compiler)

server.startCallback(() => {
  console.log(`Successfully started server on http://localhost:${config.devServer.port}`)
})
