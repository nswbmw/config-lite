var should = require('should');
var path = require('path');

describe('default config dir', function () {
  it('default', function () {
    require('..').name.should.be.exactly('config/default');
    delete require.cache[path.join(__dirname, '../index.js')];
  });
  it('production', function () {
    process.env.NODE_ENV = 'production';
    require('..').name.should.be.exactly('config/production');
    delete require.cache[path.join(__dirname, '../index.js')];
    delete process.env.NODE_ENV;
  });
  it('test', function () {
    process.env.NODE_ENV = 'test';
    require('..').name.should.be.exactly('config/test');
    delete require.cache[path.join(__dirname, '../index.js')];
    delete process.env.NODE_ENV;
  });
  it('basedir', function () {
    process.env.NODE_ENV = 'test';
    process.env.basedir = path.join(__dirname, 'config2');
    require('..').name.should.be.exactly('config/test');
    delete require.cache[path.join(__dirname, '../index.js')];
    delete process.env.NODE_ENV;
    delete process.env.basedir;
  });
});

describe('custom config', function () {
  it('default', function () {
    process.env.moduleDirectory = 'config2';
    require('..').name.should.be.exactly('config2/default');
    delete require.cache[path.join(__dirname, '../index.js')];
    delete process.env.NODE_ENV;
  });
  it('production', function () {
    process.env.moduleDirectory = 'config2';
    process.env.NODE_ENV = 'production';
    require('..').name.should.be.exactly('config2/production');
    delete require.cache[path.join(__dirname, '../index.js')];
    delete process.env.NODE_ENV;
  });
  it('test', function () {
    process.env.moduleDirectory = 'config2';
    process.env.NODE_ENV = 'test';
    require('..').name.should.be.exactly('config2/test');
    delete require.cache[path.join(__dirname, '../index.js')];
    delete process.env.NODE_ENV;
  });
  it('basedir', function () {
    process.env.moduleDirectory = 'config2';
    process.env.NODE_ENV = 'test';
    process.env.basedir = path.join(__dirname, 'config');
    require('..').name.should.be.exactly('config2/test');
    delete require.cache[path.join(__dirname, '../index.js')];
    delete process.env.NODE_ENV;
    delete process.env.basedir;
  });
});