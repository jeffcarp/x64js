var syscalls = module.exports = {};

syscalls[20] = function(cpu) {
  cpu.registers.rax = 89;
  return cpu;
};
