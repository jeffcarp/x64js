var util = require('../util');
var assert = require('chai').assert;
var specData = require('./spec-data');
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

  describe('readIntermediate', function() {
    it('replaces registers with their values', function() {
      cpu.registers.rbx = 4;
      var res = util.readIntermediate(cpu, '[rbx]');
      assert.equal(res, '[4]');
    });
    it('successfully computes 1835', function() {
      assert.isTrue(util.x86parity(1835));
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

  describe('isALabel', function() {
    it('finds _start', function() {
      cpu = x64.loadProgramIntoMemory(cpu, specData.tinyProgram());
      assert.isTrue(util.isALabel(cpu, '_start'));
    });
    it('does not have its jimmies rustled', function() {
      cpu = x64.loadProgramIntoMemory(cpu, specData.tinyProgram());
      assert.isFalse(util.isALabel(cpu, 'jimmies'));
    });
  });

  describe('isAnIntermediate', function() {
    it('detects opening and closing square brackets', function() {
      assert.isTrue(util.isAnIntermediate('[1+1]'));
    });
  });

});
