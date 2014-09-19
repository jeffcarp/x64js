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

    describe('instructions:', function() {

      describe('mov', function() {
        it('should assign the rax register', function() {
          cpu = x64.executeInstruction(cpu, 'mov rax, 5');
          assert.equal(cpu.registers.rax, 5);
        });
      });

      describe('add', function() {
        it('adds src to dest by replacing dest', function() {
          cpu = x64.executeInstruction(cpu, 'mov rax, 7');
          cpu = x64.executeInstruction(cpu, 'mov rbx, 3');
          cpu = x64.executeInstruction(cpu, 'add rax, rbx');
          assert.equal(cpu.registers.rax, 10);
          assert.equal(cpu.registers.rbx, 3);
        });
      });

    });
  });
});
