'use strict';

var assert = require('assert');
var config = require('./app');

assert.deepEqual({
  age: 100,
  port: 3000,
  name: 'app/config/test'
}, config);