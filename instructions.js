var instructions = module.exports = {};
var syscalls = require('./syscalls');
var util = require('./util');

instructions.add = function(cpu, args) {
  var dest = args[0];
  var src = args[1];
  cpu.registers[dest] = cpu.registers[dest] + cpu.registers[src];
  return cpu;
};

instructions['call'] =  function(cpu, args) {
  // Push the return pointer onto the stack
  cpu.stack.push(cpu.registers.rip);
  var address = Number(args[0]);
  cpu.registers.rip = address;
  return cpu;
};

instructions.cld = function(cpu, args) {
  cpu.registers.flags.DF = false;
  return cpu;
};

instructions.int = function(cpu, args) {
  var vector = args[0];
  if (vector === '0x80') {
    var num = Number(cpu.registers.rax);
    if (num in syscalls) {
      cpu = syscalls[num](cpu);
    }
    else {
      throw "System call number "+num+" not found.";;
    }
  }
  else {
    throw "Interrupt vector "+vector+" not found.";;
  }
  return cpu;
};

instructions.jmp = function(cpu, args) {
  var value = args[0];
  if (util.isALabel(cpu, value)) {
    var address = util.findLabelIndexStrict(cpu, value)
    cpu.registers.rip = address;
  }
  else {
    cpu.registers.rip = value;
  }
  return cpu;
};

instructions.jz = function(cpu, args) {
  if (cpu.registers.flags.ZF) {
    cpu.registers.rip = args[0];
  }
  return cpu;
};

instructions.lea = function(cpu, args) {
  var dest = args[0];
  var value = args[1];
  if (util.isAnIntermediate(value)) {
    value = util.execIntermediate(cpu, value);
  }
  else if (util.isARegister(cpu, value)) {
    value = cpu.registers[value];
  }
  cpu.registers[dest] = Number(value);
  return cpu;
};

instructions.mov = function(cpu, args) {
  var dest = args[0];
  var value = args[1];
  if (util.isARegister(cpu, value)) {
    value = cpu.registers[value];
  }
  cpu.registers[dest] = Number(value);
  return cpu;
};

instructions.not = function(cpu, args) {
  var src = args[0];
  var value = Number(cpu.registers[src]);
  cpu.registers[src] = ~value;
  return cpu;
};

instructions.pop = function(cpu, args) {
  var dest = args[0];
  var value = cpu.stack.pop();
  if (util.isARegister(cpu, value)) {
    value = cpu.registers[value];
  }
  cpu.registers[dest] = value;
  return cpu;
};

instructions.push = function(cpu, args) {
  var value = args[0];
  if (!util.isARegister(cpu, value)) {
    value = Number(value);
  }
  cpu.stack.push(value);
  return cpu;
};

instructions.ret = function(cpu, args) {
  cpu.registers.rip = cpu.stack.pop();
  return cpu;
};

instructions.test = function(cpu, args) {
  var one = cpu.registers[args[0]];
  var two = cpu.registers[args[1]];
  var result = Number(one) & Number(two);
  cpu.registers.flags.SF = result >= 0;
  cpu.registers.flags.ZF = result === 0;
  cpu.registers.flags.PF = util.x86parity(result);
  return cpu;
};

instructions.xor = function(cpu, args) {
  var src = args[0];
  var dest = args[1];
  cpu.registers[src] = cpu.registers[src] ^ cpu.registers[dest];
  return cpu;
};
