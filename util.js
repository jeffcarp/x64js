var util = module.exports = {};

util.isARegister = function(cpu, name) {
  return name in cpu.registers;
};

util.isAnIntermediate = function(op) {
  var firstChar = op[0];
  var lastChar = op.slice(op.length-1);
  return firstChar === '[' && lastChar === ']';
};

util.readIntermediate = function(cpu, value) {
  Object.keys(cpu.registers).forEach(function(key) {
    if (value.indexOf(key) !== -1) {
      var regValue = cpu.registers[key];
      value = value.replace(key, regValue);
    }
  });
  return value;
};

util.execIntermediate = function(cpu, value) {
  var interpreted = util.readIntermediate(cpu, value);
  var expression = interpreted.split('');
  expression.shift();
  expression.pop();
  expression = expression.join('');
  // TODO: Find a way to do this without eval
  return eval(expression);
};

util.x86parity = function(val) {
  // The PF flag on the x86 architecture
  // only represents the least significant
  // byte of the result
  // Returns true if num of bits set (in last byte) is even
  var isOne = function(x) {
    return Number(x) === 1;
  };

  // Maybe break up this fn?
  val = val.toString(2); // to binary
  var offset = val.length - 8;
  if (offset < 0) offset = 0;
  val = val.slice(offset); // last byte
  var numOnes = val.split('').filter(isOne).length; // num ones
  return numOnes % 2 === 0;
};

util.findLabelIndexStrict = function(cpu, label) {
  var labelIndex = util.findLabelIndex(cpu, label);
  if (labelIndex === -1) {
    throw new Error("Couldn't find '"+label+"' label in program.");
  }
  return labelIndex;
};

util.findLabelIndex = function(cpu, label) {
  return cpu.memory.reduce(function(acc, instruction, index) {
    instruction = instruction.replace(/;.*$/, '');
    instruction = instruction.trim();
    return instruction === label+':' ? index : acc;
  }, -1);
};

util.isALabel = function(cpu, value) {
  return cpu.memory.some(function(op) {
    var cmp = op.trim().replace(':', '');
    return cmp === value;
  });
};

util.opFromInstruction = function(instruction) {
  return instruction
    .replace(/;.*$/, '')
    .trim()
    .split(' ')
    .shift();
};

util.getDataSection = function(cpu) {
  var inData = false;
  return cpu.memory.filter(function(op) {
    if (util.opFromInstruction(op) === 'section') {
      var name = util.getArguments(op).shift();
      inData = name === '.data';
    }
    return inData;
  });
};

util.isAData = function(cpu, str) {
  return util.getDataSection(cpu).some(function(op) {
    return util.opFromInstruction(op) === str;
  });
};

util.getDataValue = function(cpu, str) {
  var ops = util.getDataSection(cpu).filter(function(op) {
    return util.opFromInstruction(op) === str;
  });
  var op = ops.shift();
  op = op.replace(',', ' ');
  var args = util.getArguments(op).slice(1)
  args = args.map(function(arg) {
    if (arg.slice(0, 2) === '0x') {
      return String.fromCharCode(arg);
    }
    else if (arg[0] === "'") {
      return arg.slice(1, arg.length-1);
    }
    else {
      return arg;
    }
  });
  console.log(args.join(' '));
  return args.join(' ');
};

util.getArguments = function(str) {
  // TODO: ew
  str = str.replace(/;.*$/, '');

  return str.replace(',', ' ')
            .trim()
            .split(' ')
            .slice(1)
            .filter(function(x) { return x.length }); // hack
};
