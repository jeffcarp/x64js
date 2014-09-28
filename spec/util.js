var util = require('../util');
var assert = require('chai').assert;
var x64 = require('../main');
var cpu;

var setsCpu = function() {
  cpu = x64.aBlankCpu();
};

describe('util', function() {

  beforeEach(setsCpu);

  describe('isARegister', function() {
    it('recognizes a register', function() {
      assert.isTrue(util.isARegister(cpu, 'rax'));
    });
    it('rejects a random string', function() {
      assert.isFalse(util.isARegister(cpu, 'asdf'));
    });
    it('rejects an integer', function() {
      assert.isFalse(util.isARegister(cpu, 1));
    });
  });

  describe('x86parity', function() {
    it('successfully computes 8', function() {
      assert.isFalse(util.x86parity(8));
    });
    it('successfully computes 1835', function() {
      assert.isTrue(util.x86parity(1835));
    });
  });

});