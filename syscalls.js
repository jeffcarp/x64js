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
  cpu.stdout += 'testtest';
  return cpu;
};

// getpid()
syscalls[20] = function(cpu) {
  cpu.registers.rax = 89; // Dummy pid for now
  return cpu;
};
