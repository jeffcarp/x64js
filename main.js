var x64 = module.exports = {};

var instructions = require('./instructions');
var util = require('./util');

x64.aBlankCpu = function() {
  return {
    stdin: '',
    stdout: '',
    stderr: '',
    globals: [],
    registers: {
      rax: 0,
      rbx: 0,
      rcx: 0,
      rdx: 0,
      rip: 0,
      flags: {}
    },
    stack: [],
    memory: [],
    finished: false
  };
};

// Takes an array of strings
x64.loadProgramIntoMemory = function(cpu, instructions) {

  // Naive 1 program-per-time for now
  cpu.memory = instructions.slice(0); // copy

  // Set rip to _start
  cpu.registers.rip = util.findLabelIndexStrict(cpu, '_start');

  // Push argc (0 for now) onto stack
  cpu.stack.push(0);

  // Read globals
  cpu.globals = cpu.memory.filter(function(instr) {
    return util.opFromInstruction(instr) === 'global';
  }).map(function(instr) {
    return util.getArguments(instr).shift();
  });

  return cpu;
};

// Would be nice to have:
x64.loadProgramIntoMemoryFromFile = null;

x64.stepProgramOnce = function(cpu) {

  if (cpu.finished) {
    console.log('Cpu has finished executing.');
    return cpu;
  }

  var instruction = cpu.memory[cpu.registers.rip];
  instruction = instruction.trim(); // Should not have to do this here
  cpu.registers.rip += 1; // rip is the next instruction if no branching
  cpu = x64.executeInstruction(cpu, instruction);

  return cpu;
};

x64.executeProgram = function(cpu) {

  var instructionCount = 0;

  while (!cpu.finished) {

    if (instructionCount > 100) {
      throw new Error('Over 100 instructions.');
    }

    var instruction = cpu.memory[cpu.registers.rip];
    instruction = instruction.trim(); // Should not have to do this here
    cpu.registers.rip += 1;

    cpu = x64.executeInstruction(cpu, instruction);
  }

  return cpu;
};

x64.executeInstruction = function(cpu, instruction) {

  var opCode = util.opFromInstruction(instruction);
  var args = util.getArguments(instruction);
  if (cpu.debug) {
    console.info(cpu);
  }
  if (isValidInstruction(opCode)) {
    cpu = instructions[opCode](cpu, args);
  }
  return cpu;
};

var jumpToLabel = function(cpu, label) {
  var labelIndex = util.findLabelIndexStrict(cpu, label);
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

