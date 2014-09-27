var instructions = module.exports = {};
var syscalls = require('./syscalls');

instructions.add = function(cpu, args) {
  var dest = args[0];
  var src = args[1];
  cpu.registers[dest] = cpu.registers[dest] + cpu.registers[src];
  return cpu;
};

instructions['call'] =  function(cpu, args) {
  // Push the return pointer onto the stack
  cpu.stack.push(cpu.instructionPointer);
  // Breaking change -- address should be inserted at compile time
  //var label = args[0];
  //var labelIndex = findLabelIndexStrict(cpu, label);
  var address = Number(args[0]);
  cpu.registers.eip = address;
  //cpu.instructionPointer = labelIndex;
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
  cpu.registers.eip = args[0];
  return cpu;
  // !! Breaking change
  //return jumpToLabel(cpu, args[0]);
};

instructions.jz = function(cpu, args) {
  if (cpu.registers.flags.ZF) {
    cpu.registers.eip = args[0];
    //cpu = jumpToLabel(cpu, args[0]);
  }
  return cpu;
};

instructions.mov = function(cpu, args) {
  var register = args[0];
  cpu.registers[register] = Number(args[1]);
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
  var register = cpu.stack.pop();
  cpu.registers[dest] = cpu.registers[register];
  return cpu;
};

instructions.push = function(cpu, args) {
  cpu.stack.push(args[0]);
  return cpu;
};

instructions.ret = function(cpu, args) {
  // Take the return pointer off of the stack
  var returnPointer = cpu.stack.pop();
  cpu.instructionPointer = returnPointer;
  return cpu;
};

instructions.test = function(cpu, args) {
  var one = cpu.registers[args[0]];
  var two = cpu.registers[args[1]];
  var result = Number(one) & Number(two);
  console.log('result', result);
  cpu.registers.flags.SF = result >= 0;
  cpu.registers.flags.ZF = result === 0;
  return cpu;
};

instructions.xor = function(cpu, args) {
  var src = args[0];
  var dest = args[1];
  cpu.registers[src] = cpu.registers[src] ^ cpu.registers[dest];
  return cpu;
};
