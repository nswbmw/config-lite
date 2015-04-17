var resolve = require('resolve');
var path = require('path');

var id = process.env.NODE_ENV || 'default';
var CONFIG_BASEDIR = process.env.CONFIG_BASEDIR || process.cwd();
var CONFIG_DIR = process.env.CONFIG_DIR || 'config';

try {
  var filepath = resolve.sync(id, {
    basedir: CONFIG_BASEDIR,
    extensions: ['.js', '.json', '.node'],
    moduleDirectory: CONFIG_DIR
  });
  module.exports = require(filepath);
} catch (e) {
  throw new Error('Cannot read config: ' + path.join(CONFIG_BASEDIR, CONFIG_DIR + '/' + id));
}