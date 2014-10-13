var util = require('./util');

var syscalls = module.exports = {};

// exit()
syscalls[1] = function(cpu) {
  cpu.finished = true;
  return cpu;
};

// write()
// rbx:   file descriptor (1 is stdout)
// rcx:   pointer to first char
// rdx:   message length in bytes
syscalls[4] = function(cpu) {
  var fd = cpu.registers.rbx;
  var address = cpu.registers.rcx;
  if (fd === 1) {
    var value = util.getDataValueFromPointer(cpu, address);
    cpu.stdout += value;
  }
  // Else, write to file?
  return cpu;
};

// getpid()
syscalls[20] = function(cpu) {
  cpu.registers.rax = 89; // Dummy pid for now
  return cpu;
};
