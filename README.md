## config-lite

A super simple & flexible & intuitive config module, support `yaml` & `toml`.

### Install

```bash
$ npm i config-lite --save
```

### Usage

```js
const config = require('config-lite')(__dirname);
```

or:

```js
const config = require('config-lite')({
  filename: 'test',
  config_basedir: __dirname,
  config_dir: 'config'
});
```

### Options

- filename: config file name, default: `default`, support: `['.js', '.json', '.node', '.yaml', '.yml', '.toml']`.
- config_basedir: directory for begining bubbling find config directory.
- config_dir: config directory name, default: `config`.
- config: default config object that overwrite config file.

### Priority

environment option > custom option > default option

For example:

```bash
$ NODE_ENV=production NODE_CONFIG='{"port":3000}' node app.js
```

loading order:

`NODE_CONFIG='{"port":3000}'` > opt.config > production config file > default config file

### Environment Variables

- NODE_ENV -> filename
- CONFIG_BASEDIR || NODE_CONFIG_BASEDIR -> config_dirname
- CONFIG_DIR || NODE_CONFIG_DIR -> config_dir
- CONFIG || NODE_CONFIG -> config

### Test

```bash
$ npm test
```

### License

MIT
