const assert = require('assert')
const config = require('..')(__dirname)

assert.deepEqual({
  name: 'default',
  mongodb: { name: 'production', url: 'url' }
}, config)
