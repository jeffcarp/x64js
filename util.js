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
