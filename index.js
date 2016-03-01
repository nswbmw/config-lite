'use strict';

var fs = require('fs');
var resolve = require('resolve');
var yaml = require('js-yaml');
var merge = require('merge-descriptors');
var argv = require('optimist').argv;

var filename = process.env.NODE_ENV || 'default';
var CONFIG_BASEDIR = process.env.CONFIG_BASEDIR || process.cwd();
var CONFIG_DIR = process.env.CONFIG_DIR || 'config';
var CONFIG = merge(JSON.parse(process.env.CONFIG || '{}'), argv);

var config = module.exports = loadConfig(filename);
try {
  module.exports = merge(config, loadConfig('default'), false);
} catch (e) {}

function loadConfig(filename) {
  var filepath = resolve.sync(filename, {
    basedir: CONFIG_BASEDIR,
    extensions: ['.js', '.json', '.node', '.yaml', '.yml'],
    moduleDirectory: CONFIG_DIR
  });
  if (/\.ya?ml$/.test(filepath)) {
    return merge(CONFIG, yaml.safeLoad(fs.readFileSync(filepath , 'utf8')), false);
  } else {
    return merge(CONFIG, require(filepath), false);
  }
}