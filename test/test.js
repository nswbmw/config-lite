'use strict';

var assert = require('assert');
var config = require('./app');

if (process.env.NAME) {
  assert.deepEqual({
    age: 100,
    port: 3000,
    name: process.env.NAME
  }, config);
} else {
  assert.deepEqual({
    age: 100,
    port: 3000,
    name: 'app/config/test'
  }, config);
}
