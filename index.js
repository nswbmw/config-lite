'use strict';

var fs = require('fs');
var path = require('path');

var _ = require('lodash');
var chalk = require('chalk');
var yaml = require('js-yaml');
var resolve = require('resolve');
var argv = require('optimist').argv;

var NODE_ENV = process.env.NODE_ENV;
var CONFIG_BASEDIR = process.env.CONFIG_BASEDIR || process.env.NODE_CONFIG_BASEDIR;
var CONFIG_DIR = process.env.CONFIG_DIR || process.env.NODE_CONFIG_DIR;
var CONFIG = _.assign({}, JSON.parse(process.env.CONFIG || process.env.NODE_CONFIG || '{}'), _.omit(argv, '_', '$0'));

module.exports = function configLite(customOpt) {
  var config = {};
  if (!_.isPlainObject(customOpt)) {
    if (customOpt && _.isString(customOpt)) {
      customOpt = { config_basedir: customOpt };
    } else {
      throw new TypeError('config-lite custom option should be a string or an object');
    }
  }
  var opt = {
    filename: NODE_ENV || customOpt.filename || 'default',
    config_basedir: CONFIG_BASEDIR || customOpt.config_basedir,
    config_dir: CONFIG_DIR || customOpt.config_dir || 'config'
  };

  if (opt.filename !== 'default') {
    try {
      config = loadConfigFile(opt.filename, opt);
    } catch (e) {
      console.error(chalk.red('config-lite load "' + opt.filename + '" failed.'));
      console.error(chalk.red(e.stack));
    }
  }

  try {
    config = _.assign({}, loadConfigFile('default', opt), config);
  } catch (e) {
    console.error(chalk.red('config-lite load "default" failed.'));
    console.error(chalk.red(e.stack));
  }
  return _.assign({}, config, customOpt.config, CONFIG);
}

function loadConfigFile(filename, opt) {
  var filepath = resolve.sync(filename, {
    basedir: opt.config_basedir,
    extensions: ['.js', '.json', '.node', '.yaml', '.yml'],
    moduleDirectory: opt.config_dir
  });
  if (/\.ya?ml$/.test(filepath)) {
    return yaml.safeLoad(fs.readFileSync(filepath , 'utf8'));
  } else {
    return require(filepath);
  }
}
