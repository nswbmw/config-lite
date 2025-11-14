## config-lite

A super simple & flexible & intuitive config module, support `yaml` & `toml`.

### Install

```bash
$ npm i config-lite --save
```

### Usage

```js
const config = require('config-lite')
```

Or with ES modules:

```js
import config from 'config-lite'
```

### Directory Structure

```
.
├── config
│   ├── default.js
│   └── production.js
└── example.js
```

Configuration is controlled via environment variables:

- `NODE_ENV`: which config file to load, default: `default`.
- `CONFIG_BASEDIR` / `NODE_CONFIG_BASEDIR`: base directory to start looking for the config directory, default: the directory where `config-lite` is installed (usually `node_modules/config-lite`).
- `CONFIG_DIR` / `NODE_CONFIG_DIR`: config directory name, default: `config`.
- `CONFIG` / `NODE_CONFIG`: JSON string that overwrites values from config files, eg: `NODE_CONFIG='{"port":3000}'`.

Supported config file extensions:

- `.js`, `.json`, `.node`, `.yaml`, `.yml`, `.toml`.

For `.yaml` / `.yml` support you need to install [`js-yaml`](https://www.npmjs.com/package/js-yaml), and for `.toml` support you need [`toml`](https://www.npmjs.com/package/toml).

### Merge Order

Configuration files are merged using `lodash.merge`, where later sources override earlier ones:

```
merge({}, default file, ${NODE_ENV} file, environment variables)
```

When running with `NODE_ENV=production`:

```bash
$ NODE_ENV=production NODE_CONFIG='{"port":3000}' node app.js
```

The merge order will be:

```
merge({}, default.js, production.js, {"port":3000})
```

This means `NODE_CONFIG` values take highest priority, followed by the environment-specific file (e.g., `production.js`), and finally the `default.js` file as the base.

### Test (100% coverage)

```bash
$ npm test
```

### License

MIT
