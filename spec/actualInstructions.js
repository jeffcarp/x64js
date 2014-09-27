var instructions = require('../instructions');
var assert = require('chai').assert;
var x64 = require('../main');
var cpu;

describe('instructions', function() {

  beforeEach(function() {
    cpu = x64.aBlankCpu();
  });

  describe('add', function() {
    it('adds src to dest by replacing dest', function() {
      cpu.registers.rax = 7;
      cpu.registers.rbx = 3;
      instructions.add(cpu, ['rax', 'rbx']);
      assert.equal(cpu.registers.rax, 10);
      assert.equal(cpu.registers.rbx, 3);
    });
  });

  describe('call', function() {
    it('pushes the return address onto the stack and jumps to an address', function() {
      cpu.instructionPointer = 5;
      instructions['call'](cpu, ['17']);
      assert.equal(cpu.stack[0], 5);
      assert.equal(cpu.registers.eip, 17);
    });
  });

  describe('cld', function() {
    it('sets the direction flag to 0', function() {
      cpu.registers.flags.DF = true;
      instructions.cld(cpu);
      assert.equal(cpu.registers.flags.DF, false);
    });
  });

  describe('int', function() {
    it('executes getpid syscall and receives result in rax', function() {
      cpu.registers.rax = 20;
      instructions.int(cpu, ['0x80']);
      // TODO: Find out if result actually is put in rax
      // 89 is the fake pid for now
      assert.equal(cpu.registers.rax, 89);
    });
  });

  describe('jmp', function() {
    it('sets eip to the jump address', function() {
      instructions.jmp(cpu, ['17']);
      assert.equal(cpu.registers.eip, 17);
    });
  });

  describe('jz', function() {
    it('sets EIP to address if ZF is true', function() {
      cpu.registers.eip = 77;
      cpu.registers.flags.ZF = true;
      instructions.jz(cpu, ['18']);
      assert.equal(cpu.registers.eip, 18);
    });
    it('does not set EIP if ZF is false', function() {
      cpu.registers.eip = 77;
      cpu.registers.flags.ZF = false;
      instructions.jz(cpu, ['18']);
      assert.equal(cpu.registers.eip, 77);
    });
  });

});

