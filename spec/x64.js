var assert = require('chai').assert;
var mori = require('mori');
var specData = require('./spec-data');
var x64 = require('../x64');
var cpu;

var setsCpu = function() {
  cpu = x64.aBlankCpu();
};

var assertEq = function(a, b) {
  return assert.ok(mori.equals(a, b));
};

describe('x64', function() {

  beforeEach(setsCpu);

  describe('aBlankCpu', function() {

    it('returns a full CPU', function() {
      var cpuSpec = mori.hash_map(
        'stdin',      '',
        'stdout',     '',
        'stderr',     '',
        'globals',    mori.vector(),
        'registers',  mori.hash_map(
                        'rax', 0
                      ),
        'stack',      mori.vector(),
        'memory',     mori.vector(),
        'finished',   false
      );
      assert.ok(mori.equals(cpuSpec, x64.aBlankCpu()));
    });

  });

  describe('loadProgramIntoMemory', function() {

    it('copies an array of strings into memory', function() {
      var program = specData.program('tiny-program');
      cpu = x64.loadProgramIntoMemory(cpu, program);

      var memory = mori.get(cpu, 'memory');
      assertEq(mori.vector.apply(null, program), memory);
    });

    it('sets RIP register to _start label', function() {
      var program = specData.program('tiny-program-2');
      var specMemory = mori.vector.apply(null, program);
      cpu = x64.loadProgramIntoMemory(cpu, program);

      // Blank lines don't count
      assertEq(mori.get_in(cpu, ['registers', 'rip']), 9);
      assertEq(mori.get(cpu, 'memory'), specMemory);
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

  describe('loadProgramIntoMemoryFromFile', function() {

    it('reads a file into memory', function() {
      var path = __dirname + '/data/hello-world.asm';
      cpu = x64.loadProgramIntoMemoryFromFile(cpu, path);

      assert.notEqual(cpu.memory[3], undefined);
      assert.include(cpu.memory[3], '_start');
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
