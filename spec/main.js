var assert = require('chai').assert;
var specData = require('./spec-data');
var x64 = require('../main');
var cpu;

var setsCpu = function() {
  cpu = x64.aBlankCpu();
};

describe('x64', function() {

  beforeEach(setsCpu);

  describe('aBlankCpu', function() {
    it('returns a full CPU', function() {
      var cpuSpec = {
        registers: {
          rax: 0,
          rbx: 0,
          rcx: 0,
          rdx: 0,
          eip: 0,       // next instruction
          cx: 0,        // count
          flags: {}
        },
        stack: [],
        memory: [],
        finished: false
      };
      assert.deepEqual(cpuSpec, cpu);
    });
  });

  describe('loadProgramIntoMemory', function() {
    it('copies an array of strings into memory', function() {
      var program = specData.tinyProgram();
      cpu = x64.loadProgramIntoMemory(cpu, program);
      assert.deepEqual(cpu.memory, program);
    });
    it('sets EIP register to _start label', function() {
      var program = specData.program('tiny-program-2');
      cpu = x64.loadProgramIntoMemory(cpu, program);
      assert.equal(cpu.registers.eip, 9); // Blank lines don't count
    });
    it('throws an error if no _start label found', function() {
      var fn = x64.loadProgramIntoMemory.bind(this, cpu, ['mov rax 6'])
      assert.throws(fn, "Couldn't find");
    });
  });

  describe('stepProgramOnce', function() {
    it('takes one step at a time', function() {
      cpu = x64.loadProgramIntoMemory(cpu, specData.tinyProgram());
      assert.equal(cpu.registers.eip, 0);
      cpu = x64.stepProgramOnce(cpu);
      assert.equal(cpu.registers.eip, 1);
      cpu = x64.stepProgramOnce(cpu);
      assert.equal(cpu.registers.eip, 2);
      assert.equal(cpu.registers.rax, 5);
      cpu = x64.stepProgramOnce(cpu);
      assert.equal(cpu.registers.eip, 3);
    });
  });

});
