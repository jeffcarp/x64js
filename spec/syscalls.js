var syscalls = require('../syscalls');
var assert = require('chai').assert;
var specData = require('./spec-data');
var x64 = require('../main');
var cpu;

specData.setsCpu = function() {
  cpu = x64.aBlankCpu();
};

describe('syscalls', function() {

  beforeEach(specData.setsCpu);

  describe('exit (1)', function() {

    it('sets cpu.finished to true', function() {
      syscalls[1](cpu);
      assert.isTrue(cpu.finished);
    });

  });

  describe('write (4)', function() {

    it('goes down the happy path', function() {
      cpu.registers.rbx = 1; // stdout
      cpu.registers.rcx = 1; // beginning char
      cpu.registers.rdx = 1; // length
      cpu.memory = [
        'section .data',
        'stuff db "Yello"'
      ];
      syscalls[4](cpu);
      assert.equal(cpu.stdout, 'Yello');
    });

    it('does nothing right now when passed a non-stdout FD', function() {
      cpu.registers.rbx = 12; // stdout
      cpu.registers.rcx = 0; // beginning char
      cpu.registers.rdx = 1; // length
      cpu.memory = [
        'stuff'
      ];
      syscalls[4](cpu);
      assert.equal(cpu.stdout, '');
    });

  });

  describe('getpid (20)', function() {

    it('returns a fake pid (89) for now', function() {
      syscalls[20](cpu);
      assert.equal(cpu.registers.rax, 89);
    });

  });

});
