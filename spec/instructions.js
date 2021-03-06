var instructions = require('../instructions');
var assert = require('chai').assert;
var x64 = require('../x64');
var cpu;

var setsCpu = function() {
  cpu = x64.aBlankCpu();
};

describe('instructions', function() {

  beforeEach(setsCpu);

  describe('add', function() {
    it('adds src to dest by replacing dest', function() {
      cpu.registers.rax = 7;
      cpu.registers.rbx = 3;
      cpu = instructions.add(cpu, ['rax', 'rbx']);
      assert.equal(cpu.registers.rax, 10);
      assert.equal(cpu.registers.rbx, 3);
    });
  });

  describe('call', function() {
    it('pushes the return address (RIP) onto the stack and jumps to an address', function() {
      cpu.registers.rip = 5;
      cpu = instructions['call'](cpu, ['17']);
      assert.equal(cpu.stack[0], 5);
      assert.equal(cpu.registers.rip, 17);
    });
  });

  describe('cld', function() {
    it('sets the direction flag to 0', function() {
      cpu.registers.flags.DF = true;
      cpu = instructions.cld(cpu);
      assert.equal(cpu.registers.flags.DF, false);
    });
  });

  describe('int', function() {
    it('executes getpid syscall and receives result in rax', function() {
      cpu.registers.rax = 20;
      cpu = instructions.int(cpu, ['0x80']);
      // TODO: Find out if result actually is put in rax
      // 89 is the fake pid for now
      assert.equal(cpu.registers.rax, 89);
    });
  });

  describe('jmp', function() {
    it('sets RIP to a naked address', function() {
      cpu = instructions.jmp(cpu, ['17']);
      assert.equal(cpu.registers.rip, 17);
    });
    it('sets RIP to a label\s address', function() {
      cpu = instructions.jmp(cpu, ['17']);
      assert.equal(cpu.registers.rip, 17);
    });
  });

  describe('jz', function() {
    it('sets RIP to address if ZF is true', function() {
      cpu.registers.rip = 77;
      cpu.registers.flags.ZF = true;
      cpu = instructions.jz(cpu, ['18']);
      assert.equal(cpu.registers.rip, 18);
    });
    it('does not set RIP if ZF is false', function() {
      cpu.registers.rip = 77;
      cpu.registers.flags.ZF = false;
      cpu = instructions.jz(cpu, ['18']);
      assert.equal(cpu.registers.rip, 77);
    });
  });

  // Load effective address
  describe('lea', function() {
    it('loads the calculated address of dest into src', function() {
      cpu.registers.rbx = 8; // pointer
      cpu = instructions.lea(cpu, ['rax', 'rbx']);
      assert.equal(cpu.registers.rax, 8);
    });
    it('interprets intermediates with pointers and subtraction', function() {
      cpu.registers.rcx = 8;
      cpu = instructions.lea(cpu, ['rax', '[rcx-1]']);
      assert.equal(cpu.registers.rax, 7);
    });
    it('interprets intermediates with multiplication', function() {
      cpu.registers.rcx = 8;
      cpu = instructions.lea(cpu, ['rax', '[rcx*2]']);
      assert.equal(cpu.registers.rax, 16);
    });
    it('does not modify any flags', function() {
      cpu = instructions.lea(cpu, ['rax', 'rbx']);
      assert.deepEqual(cpu.registers.flags, (x64.aBlankCpu()).registers.flags);
    });
  });

  describe('mov', function() {
    it('should assign an integer to a register', function() {
      cpu.registers.rbx = 11;
      cpu = instructions.mov(cpu, ['rbx', '18']);
      assert.equal(cpu.registers.rbx, 18);
    });
    it("assigns a data label's pointer to a register", function() {
      cpu.registers.rbx = 11;
      cpu.memory = [
        'section .data',
        'msg db "banana phone"'
      ];
      cpu = instructions.mov(cpu, ['rbx', 'msg']);
      assert.equal(cpu.registers.rbx, 1);
    });
  });

  describe('not', function() {
    it('bitwise nots a register', function() {
      cpu.registers.rcx = 7;
      cpu = instructions.not(cpu, ['rcx']);
      assert.equal(cpu.registers.rcx, -8);
    });
  });

  describe('pop', function() {
    it("takes integer from the stack to dest", function() {
      cpu.stack = [4];
      cpu = instructions.pop(cpu, ['rcx']);
      assert.deepEqual(cpu.registers.rcx, 4);
    });
    it("dereferences a pointer from the stack to dest", function() {
      cpu.registers.rbx = 12;
      cpu.stack = ['rbx'];
      cpu = instructions.pop(cpu, ['rcx']);
      assert.deepEqual(cpu.registers.rcx, 12);
    });
  });

  describe('push', function() {
    it('pushes an int onto the stack', function() {
      cpu = instructions['push'](cpu, ['14']);
      assert.deepEqual(cpu.stack, [14]);
    });
    it('pushes a pointer onto the stack', function() {
    });
  });

  describe('repne', function() {
    it('does something');
  });

  describe('ret', function() {
    it('pops a pointer from the stack to RIP', function() {
      cpu.stack.push(14);
      cpu = instructions.ret(cpu, []);
      assert.equal(cpu.registers.rip, 14);
    });
  });

  describe('test', function() {
    it('logically ANDs the two operands and sets ZF, SF, and PF', function() {
      cpu.registers.rax = 5;
      cpu = instructions.test(cpu, ['rax', 'rax']);
      assert.isTrue(cpu.registers.flags.SF); // (number < 0)
      assert.isFalse(cpu.registers.flags.ZF);
      // PF represents the parity of only the least significant byte of the result
      assert.isTrue(cpu.registers.flags.PF);
    });
  });

  describe('xor', function() {
    it('applies bitwise xor to src and dest and puts the value in src', function() {
      cpu.registers.rax = 1234;
      cpu.registers.rbx = 5678;
      cpu = instructions.xor(cpu, ['rax', 'rbx']);
      assert.equal(cpu.registers.rax, 4860);
    });
  });

});

