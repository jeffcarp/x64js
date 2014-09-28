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
        instructionPointer: -1,
        memory: []
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
  });

});
