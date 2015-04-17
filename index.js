var resolve = require('resolve');
var path = require('path');

var id = process.env.NODE_ENV || 'default';
var basedir = process.env.basedir || process.cwd();
var moduleDirectory = process.env.moduleDirectory || 'config';

try {
  var filepath = resolve.sync(id, {
    basedir: basedir,
    extensions: ['.js', '.json', '.node'],
    moduleDirectory: moduleDirectory
  });
  module.exports = require(filepath);
} catch (e) {
  throw new Error('Cannot read config: ' + path.join(basedir, moduleDirectory + '/' + id));
}