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
        stdin: '',
        stdout: '',
        stderr: '',
        globals: [],
        registers: {
          rax: 0,
          rbx: 0,
          rcx: 0,
          rdx: 0,
          rip: 0,       // next instruction
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
      var program = specData.program('tiny-program');
      cpu = x64.loadProgramIntoMemory(cpu, program);
      assert.deepEqual(cpu.memory, program);
    });

    it('sets RIP register to _start label', function() {
      var program = specData.program('tiny-program-2');
      cpu = x64.loadProgramIntoMemory(cpu, program);
      assert.equal(cpu.registers.rip, 9); // Blank lines don't count
    });

    it('throws an error if no _start label found', function() {
      var fn = x64.loadProgramIntoMemory.bind(this, cpu, ['mov rax 6'])
      assert.throws(fn, "Couldn't find");
    });

    it('the stack should be initialized with argc (0 for now)', function() {
      cpu = x64.loadProgramIntoMemory(cpu, specData.program('tiny-program'));
      assert.deepEqual(cpu.stack, [0]);
    });

    it('reads any constants into global memory', function() {
      cpu = x64.loadProgramIntoMemory(cpu, specData.program('hello-world'));
      assert.include(cpu.globals, '_start');
    });

  });

  describe('stepProgramOnce', function() {

    it('takes one step at a time', function() {
      cpu = x64.loadProgramIntoMemory(cpu, specData.program('tiny-program'));
      assert.equal(cpu.registers.rip, 0);
      cpu = x64.stepProgramOnce(cpu);
      assert.equal(cpu.registers.rip, 1);
      cpu = x64.stepProgramOnce(cpu);
      assert.equal(cpu.registers.rip, 2);
      assert.equal(cpu.registers.rax, 5);
      cpu = x64.stepProgramOnce(cpu);
      assert.equal(cpu.registers.rip, 3);
    });

  });

});
