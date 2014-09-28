_start:
  mov rax 5
  jmp exit

exit:
    mov rax 1
    xor rbx rbx
    int 0x80
