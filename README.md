## config-lite

A super simple & flexible & intuitive config module.

### Install

```
npm i config-lite --save
```

### Migration

In v1:

```
var config = require('config-lite');
```

In v2, you should specify `config_basedir` directory for bubbling find config file.

```
var config = require('config-lite')(__dirname);
```

### Usage

```
var config = require('config-lite')(__dirname);
```

or:

```
var config = require('config-lite')({
  filename: 'test',
  config_basedir: __dirname,
  config_dir: 'config'
});
```

### Options

- filename: config file name, default: `default`, support: `['.js', '.json', '.node', '.yaml', '.yml']`.
- config_basedir: directory for begining bubbling find config directory.
- config_dir: config directory name, default: `config`.
- config: default config object that overwrite config file.

### Priority

environment option > custom option > default option

For example:

```
NODE_ENV=test NODE_CONFIG='{"port":3000}' node app.js --port=3001
```

loading order:

`--port=3001` > `NODE_CONFIG='{"port":3000}'` > opt.config > test config file > default config file

### Environment Variables

- NODE_ENV -> filename
- CONFIG_BASEDIR || NODE_CONFIG_BASEDIR -> config_dirname
- CONFIG_DIR || NODE_CONFIG_DIR -> config_dir
- CONFIG || NODE_CONFIG -> config

### Test

```
npm test
```

### License

MIT
