var assert = require('chai').assert;
var x64 = require('../main');
var cpu;

describe('x64', function() {

  beforeEach(function() {
    cpu = x64.aBlankCpu();
  });

  describe('#aBlankCpu()', function() {
    var cpuSpec = {
      registers: {
        rax: 0,
        rbx: 0,
        rcx: 0,
        rdx: 0
      }
    };
    assert.deepEqual(x64.aBlankCpu(), cpuSpec);
  });

  describe('#executeInstruction()', function() {

    it('should accept a blank string and do nothing', function() {
      cpu = x64.executeInstruction(cpu, '');
      assert.deepEqual(cpu, x64.aBlankCpu());
    });

    describe('mov instruction', function() {
      it('should assign the rax register', function() {
        cpu = x64.executeInstruction(cpu, 'mov rax, 5');
        assert.equal(cpu.registers.rax, 5);
      });
    });

  });
});
