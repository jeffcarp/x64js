; Lifted from http://asm.sourceforge.net/intro/hello.html

section     .text
global      _start                              ;must be declared for linker (ld)

_start:                                         ;tell linker entry point

    mov     rdx,len                             ;message length
    mov     rcx,msg                             ;message to write
    mov     rbx,1                               ;file descriptor (stdout)
    mov     rax,4                               ;system call number (sys_write)
    int     0x80                                ;call kernel

    mov     rax,1                               ;system call number (sys_exit)
    int     0x80                                ;call kernel

section     .data

msg     db  'Hello, world!',0xa                 ;our dear string
len     equ $ - msg                             ;length of our dear string
