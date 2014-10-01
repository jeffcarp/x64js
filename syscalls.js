var syscalls = module.exports = {};

// exit
syscalls[1] = function(cpu) {
  cpu.finished = true;
  return cpu;
};

// getpid
syscalls[20] = function(cpu) {
  cpu.registers.rax = 89; // Dummy pid for now
  return cpu;
};
