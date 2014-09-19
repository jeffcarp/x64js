var x64 = {};

x64.aBlankCpu = function() {
  return {
    registers: {
      rax: 0,
      rbx: 0,
      rcx: 0,
      rdx: 0
    }
  };
};

x64.executeInstruction = function(cpu, instruction) {
  var opCode = instruction.split(' ').shift();
  var args = getArguments(instruction);
  if (isValidInstruction(opCode)) {
    cpu = instructions[opCode](cpu, args);
  }
  return cpu;
};

// Reads an asm program string
x64.readString = function(cpu, program) {
  if (typeof program !== 'string') {
    return;
  }
  return program.split('\n').reduce(x64.executeInstruction, cpu);
};

var instructions = {
  mov: function(cpu, args) {
    var register = args[0];
    cpu.registers[register] = Number(args[1]);
    return cpu;
  }
};

var isValidInstruction = function(instruction) {
  // TODO: Make sure memory access is secure
  return instruction in instructions;
};

var isValidRegister = function(register) {
  return register in registers;
};

var getArguments = function(str) {
  // TODO: instructions are assumed to have a space after the comma
  return str.replace(',', '')
            .split(' ')
            .slice(1);
};

module.exports = x64;
