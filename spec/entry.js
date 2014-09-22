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
      },
      stack: [],
      instructionPointer: -1,
      memory: []
    };
    assert.deepEqual(x64.aBlankCpu(), cpuSpec);
  });

  describe('#executeInstruction()', function() {

    it('should accept a blank string and do nothing', function() {
      cpu = x64.executeInstruction(cpu, '');
      assert.deepEqual(cpu, x64.aBlankCpu());
    });
  });

  describe('#readString()', function() {
    it('executes multiple instructions', function() {
      var str = [
        'mov rax 6',
        'mov rbx 7'
      ].join('\n');
      cpu = x64.readString(cpu, str);
      assert.equal(cpu.registers.rax, 6);
      assert.equal(cpu.registers.rbx, 7);;
    });
  });
});
