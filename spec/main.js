var assert = require('chai').assert;
var specData = require('./spec-data');
var x64 = require('../main');
var cpu;

describe('x64', function() {

  beforeEach(function() {
    cpu = x64.aBlankCpu();
  });

  describe('aBlankCpu', function() {
    var cpuSpec = {
      registers: {
        rax: 0,
        rbx: 0,
        rcx: 0,
        rdx: 0,
        cx: 0,        // count
        flags: {}
      },
      stack: [],
      instructionPointer: -1,
      memory: []
    };
    //assert.deepEqual({}, {});
  });

  describe('loadProgramIntoMemory', function() {
    it('copies an array of strings', function() {
      var program = specData.tinyProgram();
      cpu = x64.loadProgramIntoMemory(cpu, program);
      assert.deepEqual(cpu.memory, program);
    });
  });
});
