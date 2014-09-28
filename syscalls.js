var syscalls = module.exports = {};

// exit()
syscalls[1] = function(cpu) {
  cpu.finished = true;
  return cpu;
};

// getpid()
syscalls[20] = function(cpu) {
  // Dummy pid for now
  cpu.registers.rax = 89;
  return cpu;
};
