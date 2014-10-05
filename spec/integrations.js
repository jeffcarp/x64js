var assert = require('chai').assert;
var specData = require('./spec-data');
var x64 = require('../main');
var cpu;

var setsCpu = function() {
  cpu = x64.aBlankCpu();
};

describe('integration tests:', function() {

  beforeEach(setsCpu);

  it('runs tiny-program.asm', function() {
    var program = specData.program('tiny-program');
    cpu = x64.loadProgramIntoMemory(cpu, program);
    cpu = x64.executeProgram(cpu);

    assert.isTrue(cpu.finished);
    assert.deepEqual(cpu.stack, [0]);
    assert.equal(cpu.registers.rax, 1);
    assert.equal(cpu.registers.rbx, 0);
    assert.equal(cpu.registers.rip, 7);
  });

  // This is going to require a lot of work
  // before it passes.
  it('runs hello-world.asm', function() {
    var program = specData.program('hello-world');
    cpu = x64.loadProgramIntoMemory(cpu, program);
    cpu = x64.executeProgram(cpu);

    assert.isTrue(cpu.finished);
    assert.equal(cpu.registers.rax, 1);
    assert.equal(cpu.registers.rbx, 1);

    // Not testing the right thing yet
    assert.equal(cpu.stdout, 'Hello, world!\n');
  });

});
