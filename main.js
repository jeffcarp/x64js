var x64 = {};

var instructions = require('./instructions');

x64.aBlankCpu = function() {
  return {
    registers: {
      rax: 0,
      rbx: 0,
      rcx: 0,
      rdx: 0,
      eip: 0,
      cx:  0,
      flags: {}
    },
    stack: [],
    instructionPointer: -1,
    memory: []
  };
};

x64.loadProgramIntoMemory = function(cpu, instructions) {
  // Naive 1 program-per-time for now
  cpu.memory = instructions.slice(0); // copy
  return cpu;
};

x64.executeProgram = function(cpu) {

  var startPointer = findLabelIndexStrict(cpu, '_start');
  cpu.instructionPointer = startPointer;
  var instructionCount = 0;

  while (hasNextInstruction(cpu)) {

    if (instructionCount > 100) {
      throw new Error('Over 100 instructions.');
    }

    cpu.instructionPointer += 1;
    instructionCount += 1;
    var instruction = cpu.memory[cpu.instructionPointer];
    instruction = instruction.trim(); // Should not have to do this here

    cpu = x64.executeInstruction(cpu, instruction);
  }

  return cpu;
};

var hasNextInstruction = function(cpu) {
  var instruction = cpu.memory[cpu.instructionPointer + 1];
  return instruction && instruction.length;
};

var findLabelIndexStrict = function(cpu, label) {
  var labelIndex = findLabelIndex(cpu, label);
  if (labelIndex === -1) {
    throw new Error("Couldn't find '"+label+"' label in program.");
  }
  return labelIndex;
};

var findLabelIndex = function(cpu, label) {
  return cpu.memory.reduce(function(acc, instruction, index) {
    return instruction === label+':' ? index : acc;
  }, -1);
};

x64.executeInstruction = function(cpu, instruction) {
  var opCode = instruction.split(' ').shift();
  var args = getArguments(instruction);
  if (cpu.debug) {
    console.log(cpu);
  }
  if (isValidInstruction(opCode)) {
    cpu = instructions[opCode](cpu, args);
  }
  return cpu;
};

// Reads an asm program string
x64.readString = function(cpu, program) {
  if (program instanceof Array) {
    program = program.join('\n');
  }
  if (typeof program !== 'string') {
    throw new Error('program was not a string');
  }
  return program.split('\n').reduce(x64.executeInstruction, cpu);
};

var jumpToLabel = function(cpu, label) {
  var labelIndex = findLabelIndexStrict(cpu, label);
  // TODO: Blow up if no index?
  // Or should an error be returning a pointer
  // to an exception handler?
  cpu.instructionPointer = labelIndex;
  return cpu;
};

var isValidInstruction = function(instruction) {
  // TODO: Make sure memory access is secure
  return instruction in instructions;
};

var isValidRegister = function(register) {
  return register in registers;
};

var isALabel = function(instruction) {
  // Naive
  return instruction.indexOf(':') !== -1;
};

var getArguments = function(str) {
  // TODO: instructions are assumed to have a space after the comma
  return str.replace(',', '')
            .split(' ')
            .slice(1);
};

module.exports = x64;
