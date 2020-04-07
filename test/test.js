const assert = require('assert')
const config = require('..')(__dirname)

assert.deepEqual({
  age: 100,
  name: 'production',
  mongodb: { db: 'production', url: 'default' }
}, config)
