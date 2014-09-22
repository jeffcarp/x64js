var x64 = {};

x64.aBlankCpu = function() {
  return {
    registers: {
      rax: 0,
      rbx: 0,
      rcx: 0,
      rdx: 0
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
    console.log('>>>> instruction', instructionCount, instruction);

    cpu = x64.executeInstruction(cpu, instruction);
    console.log(cpu);
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

var instructions = {
  add: function(cpu, args) {
    var dest = args[0];
    var src = args[1];
    cpu.registers[dest] = cpu.registers[dest] + cpu.registers[src];
    return cpu;
  },
  call: function(cpu, args) {
    // Push the return pointer onto the stack
    cpu.stack.push(cpu.instructionPointer);
    var label = args[0];
    var labelIndex = findLabelIndexStrict(cpu, label);
    cpu.instructionPointer = labelIndex;
    return cpu;
  },
  jmp: function(cpu, args) {
    var label = args[0];
    var labelIndex = findLabelIndexStrict(cpu, label);
    cpu.instructionPointer = labelIndex;
    return cpu;
  },
  mov: function(cpu, args) {
    var register = args[0];
    cpu.registers[register] = Number(args[1]);
    return cpu;
  },
  not: function(cpu, args) {
    var src = args[0];
    var value = Number(cpu.registers[src]);
    cpu.registers[src] = ~value;
    return cpu;
  },
  pop: function(cpu, args) {
    var dest = args[0];
    var register = cpu.stack.pop();
    cpu.registers[dest] = cpu.registers[register];
    return cpu;
  },
  push: function(cpu, args) {
    cpu.stack.push(args[0]);
    return cpu;
  },
  ret: function(cpu, args) {
    // Take the return pointer off of the stack
    var returnPointer = cpu.stack.pop();
    cpu.instructionPointer = returnPointer;
    return cpu;
  },
  xor: function(cpu, args) {
    var src = args[0];
    var dest = args[1];
    cpu.registers[src] = cpu.registers[src] ^ cpu.registers[dest];
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
