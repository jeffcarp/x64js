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
      stack: []
    };
    assert.deepEqual(x64.aBlankCpu(), cpuSpec);
  });

  describe('#executeInstruction()', function() {

    it('should accept a blank string and do nothing', function() {
      cpu = x64.executeInstruction(cpu, '');
      assert.deepEqual(cpu, x64.aBlankCpu());
    });

    describe('instructions:', function() {

      describe('add', function() {
        it('adds src to dest by replacing dest', function() {
          cpu = x64.executeInstruction(cpu, 'mov rax, 7');
          cpu = x64.executeInstruction(cpu, 'mov rbx, 3');
          cpu = x64.executeInstruction(cpu, 'add rax, rbx');
          assert.equal(cpu.registers.rax, 10);
          assert.equal(cpu.registers.rbx, 3);
        });
      });

      describe('mov', function() {
        it('should assign the rax register', function() {
          cpu = x64.executeInstruction(cpu, 'mov rax, 5');
          assert.equal(cpu.registers.rax, 5);
        });
      });

      describe('not', function() {
        it('bitwise nots one register', function() {
          cpu = x64.executeInstruction(cpu, 'mov rax, 7');
          cpu = x64.executeInstruction(cpu, 'not rax');
          assert.equal(cpu.registers.rax, -8);
        });
      });

      describe('pop', function() {
        it("pops a register's pointer and puts the value in dest", function() {
          cpu = x64.executeInstruction(cpu, 'mov rax, 7');
          cpu = x64.executeInstruction(cpu, 'push rax');
          cpu = x64.executeInstruction(cpu, 'pop rbx');
          assert.deepEqual(cpu.registers.rax, 7);
          assert.deepEqual(cpu.registers.rbx, 7);
        });
      });

      describe('push', function() {
        it('pushes a register pointer onto the stack', function() {
          cpu = x64.executeInstruction(cpu, 'push rax');
          assert.deepEqual(cpu.stack, ['rax']);
        });
      });

      describe('xor', function() {
        it('applies bitwise xor to src and dest and puts the value in src', function() {
          cpu = x64.readString(cpu, [
            'mov rax 1234',
            'mov rbx 5678',
            'xor rax rbx'
          ]);
          assert.equal(cpu.registers.rax, 4860);
        });
      });

      // Future instructions to implement
      it('call');
      it('cld');
      it('int');
      it('jmp');
      it('jz');
      it('lea');
      it('repne');
      it('ret');
      it('test');

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
