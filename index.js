var path = require('path');
var fs   = require('fs');
var resolve = require('resolve');
var yaml = require('js-yaml');

var id = process.env.NODE_ENV || 'default';
var CONFIG_BASEDIR = process.env.CONFIG_BASEDIR || process.cwd();
var CONFIG_DIR = process.env.CONFIG_DIR || 'config';

try {
  var filepath = resolve.sync(id, {
    basedir: CONFIG_BASEDIR,
    extensions: ['.js', '.json', '.node', '.yaml', '.yml'],
    moduleDirectory: CONFIG_DIR
  });
  if (/\.ya?ml$/.test(filepath)) {
    module.exports = yaml.safeLoad(fs.readFileSync(filepath , 'utf8'));
  } else {
    module.exports = require(filepath);
  }
} catch (e) {
  throw new Error('Cannot read config: ' + path.join(CONFIG_BASEDIR, CONFIG_DIR + '/' + id));
}