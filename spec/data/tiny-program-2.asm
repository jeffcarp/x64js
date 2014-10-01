jake:
  mov rcx 5
  jmp exit 

finn:
  mov rbx 5
  jmp jake 

exit:
  xor rbx rbx
  int 0x80

_start:
  mov rax 5
  jmp finn 
