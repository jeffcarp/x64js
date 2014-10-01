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

  describe('getpid (20)', function() {
    it('returns a fake pid (89) for now', function() {
      syscalls[20](cpu);
      assert.equal(cpu.registers.rax, 89);
    });
  });

});
