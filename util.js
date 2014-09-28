var util = module.exports = {};

util.isARegister = function(cpu, name) {
  return name in cpu.registers;
};

util.isAnIntermediate = function(cpu, op) {
  var firstChar = op[0];
  var lastChar = op.split(op.length-1);
  return firstChar === '[' && lastChar === ']';
};

util.execIntermediate = function(cpu, value) {
  return value;
};
