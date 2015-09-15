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

var getCmdLineArgs = function (searchFor) {
    var cmdLineArgs = process.argv.slice(2, process.argv.length),
        argName = '--' + searchFor + '=';

    for (var argvIt = 0; argvIt < cmdLineArgs.length; argvIt++) {
      if (cmdLineArgs[argvIt].indexOf(argName) === 0) {
        return cmdLineArgs[argvIt].substr(argName.length);
      }
    }

    return false;
}

var cmdLineConfig = getCmdLineArgs('NODE_CONFIG')
if ( cmdLineConfig ) {
    try {
          cmdLineConfig = JSON.parse(cmdLineConfig);
    } catch(e) {
          console.error('The --NODE_CONFIG={json} command line argument is malformed JSON');
    }
    CONFIG = merge(cmdLineConfig, CONFIG, false);
}

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
