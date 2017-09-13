'use strict';

const fs = require('fs');
const path = require('path');

const _ = require('lodash');
const chalk = require('chalk');
const resolve = require('resolve');
const argv = require('optimist').argv;

const NODE_ENV = process.env.NODE_ENV;
const CONFIG_BASEDIR = process.env.CONFIG_BASEDIR || process.env.NODE_CONFIG_BASEDIR;
const CONFIG_DIR = process.env.CONFIG_DIR || process.env.NODE_CONFIG_DIR;
const CONFIG = _.assign({}, JSON.parse(process.env.CONFIG || process.env.NODE_CONFIG || '{}'), _.omit(argv, '_', '$0'));

module.exports = function configLite(customOpt) {
  let config = {};
  if (!_.isPlainObject(customOpt)) {
    if (customOpt && _.isString(customOpt)) {
      customOpt = { config_basedir: customOpt };
    } else {
      throw new TypeError('config-lite custom option should be a string or an object');
    }
  }
  const opt = {
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

  const customEnvConfig = getCustomEnvVars(opt);

  return _.assign({}, config, customEnvConfig, customOpt.config, CONFIG);
}

function loadConfigFile(filename, opt) {
  const filepath = resolve.sync(filename, {
    basedir: opt.config_basedir,
    extensions: ['.js', '.json', '.node', '.yaml', '.yml', '.toml'],
    moduleDirectory: opt.config_dir
  });
  if (/\.ya?ml$/.test(filepath)) {
    return require('js-yaml').safeLoad(fs.readFileSync(filepath , 'utf8'));
  } else if (/\.toml$/.test(filepath)) {
    return require('toml').parse(fs.readFileSync(filepath , 'utf8'));
  } else {
    return require(filepath);
  }
}

function getCustomEnvVars (opt) {
  let result;

  try {
    result = loadConfigFile('custom-environment-variables', opt);
  } catch (e) {
    return {};
  }
  
  return replacementDeep(result, process.env);
}

function replacementDeep (envConfigMap, envVars) {
  const result = {};

  function _replacementVars(map, vars) {
    for (let prop in map) {
      const value = map[prop];
      if (typeof(value) === 'string') { // 叶子节点
        if (vars[value]) {
          result[prop] = vars[value];
        }
      } else if (_.isObject(value)) { // 递归
        _replacementVars(value, vars, pathTo.concat(prop));
      } else {
        msg = "Illegal key (" + prop + ") type : " + typeof(value);
        throw Error(msg);
      }
    }
  }

  _replacementVars(envConfigMap, envVars);
  return result;
}
