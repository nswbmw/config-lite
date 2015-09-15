'use strict';

var path = require('path');
var fs   = require('fs');
var resolve = require('resolve');
var yaml = require('js-yaml');
var merge = require('merge-descriptors');
var argv = require('optimist').argv;

var id = process.env.NODE_ENV || 'default';
var CONFIG_BASEDIR = process.env.CONFIG_BASEDIR || process.cwd();
var CONFIG_DIR = process.env.CONFIG_DIR || 'config';
var CONFIG = merge(JSON.parse(process.env.CONFIG || '{}'), argv);

try {
  var filepath = resolve.sync(id, {
    basedir: CONFIG_BASEDIR,
    extensions: ['.js', '.json', '.node', '.yaml', '.yml'],
    moduleDirectory: CONFIG_DIR
  });
  if (/\.ya?ml$/.test(filepath)) {
    module.exports = merge(CONFIG, yaml.safeLoad(fs.readFileSync(filepath , 'utf8')), false);
  } else {
    module.exports = merge(CONFIG, require(filepath), false);
  }
} catch (e) {
  throw new Error('Cannot read config: ' + path.join(CONFIG_BASEDIR, CONFIG_DIR + '/' + id));
}