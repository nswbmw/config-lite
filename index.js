const fs = require('node:fs')

const merge = require('lodash.merge')
const resolve = require('resolve')

const filename = process.env.NODE_ENV || 'default'
const configBasedir = process.env.CONFIG_BASEDIR || process.env.NODE_CONFIG_BASEDIR || __dirname
const configDir = process.env.CONFIG_DIR || process.env.NODE_CONFIG_DIR || 'config'
const CONFIG = merge({}, JSON.parse(process.env.CONFIG || process.env.NODE_CONFIG || '{}'))

module.exports = (function configLite () {
  let config = {}

  if (filename !== 'default') {
    try {
      config = loadConfigFile(filename)
    } catch (e) {
      console.error('config-lite load "' + filename + '" failed.')
      console.error(e.stack)
    }
  }

  try {
    config = merge({}, loadConfigFile('default'), config)
  } catch (e) {
    console.error('config-lite load "default" failed.')
    console.error(e.stack)
  }

  return merge({}, config, CONFIG)
})()

function loadConfigFile (filename) {
  const filepath = resolve.sync(filename, {
    basedir: configBasedir,
    extensions: ['.js', '.json', '.node', '.yaml', '.yml', '.toml'],
    moduleDirectory: configDir
  })
  if (/\.ya?ml$/.test(filepath)) {
    return require('js-yaml').load(fs.readFileSync(filepath, 'utf8'))
  } else if (/\.toml$/.test(filepath)) {
    return require('toml').parse(fs.readFileSync(filepath, 'utf8'))
  } else {
    return require(filepath)
  }
}
