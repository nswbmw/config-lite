## config-lite

A super simple & flexible & useful config module.

### Install

    npm i config-lite --save

### Usage

```
var config = require('config-lite');
```

By default, `require('config-lite')` will bubbling find `config` (or custom) directory from `process.cwd()`.

See [test](https://github.com/nswbmw/config-lite/blob/master/test/test.js).

### Example

**config/default.js**

```
module.exports = 'default';
```

**config/test.js**

```
module.exports = 'test';
```

**config/production.js**

```
module.exports = 'production';
```
\====================================

```
node app

require('config-lite'); //=> 'default'
```

```
NODE_ENV=test node app

require('config-lite'); //=> 'test'
```

```
NODE_ENV=production node app

require('config-lite'); //=> 'production'
```

### Test

    npm test

### License

MIT