const path = require('path')
const rootDir = path.join(__dirname, '../../')
const buildPath = path.join(rootDir, 'docs')
const staticDir = path.join(rootDir, 'static')

module.exports = {
  rootDir,
  buildPath,
  staticDir
}
