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
      cpu = x64.loadProgramIntoMemory(cpu, specData.program('tiny-program'));
      assert.isTrue(util.isALabel(cpu, '_start'));
    });
    it('does not have its jimmies rustled', function() {
      cpu = x64.loadProgramIntoMemory(cpu, specData.program('tiny-program'));
      assert.isFalse(util.isALabel(cpu, 'jimmies'));
    });
  });

  describe('isAnIntermediate', function() {
    it('detects opening and closing square brackets', function() {
      assert.isTrue(util.isAnIntermediate('[1+1]'));
    });
  });

  describe('isAData', function() {

    it('finds an existing data label', function() {
      var program = specData.program('hello-world');
      cpu = x64.loadProgramIntoMemory(cpu, program);
      assert.isTrue(util.isAData(cpu, 'msg'));
    });

    it('correctly identifies a non-data label', function() {
      var program = specData.program('hello-world');
      cpu = x64.loadProgramIntoMemory(cpu, program);
      assert.isFalse(util.isAData(cpu, 'flubber'));
    });

  });

  describe.only('getDataValue', function() {

    it('handles db string values', function() {
      var program = specData.program('hello-world');
      cpu = x64.loadProgramIntoMemory(cpu, program);
      var msg = util.getDataValue(cpu, 'msg');
      assert.equal(msg, 'Hello, world!\n');
    });

  });

});
