This is an attempt to create a toy CPU interpreting a subset of the x86\_64 instruction set in JavaScript.

## TODO

- [x] Add public API usage in README (`aBlankCpu()`, `stepProgramOnce()`)
- [x] Implement the 13 instructions stubbed in `test/test.js`
- [x] Implement labels (could be improved)
- [ ] Implement `db` and `dd` pseudo-instructions (from nasm)
- [x] Implement `section .text` with `global` keyword
- [x] Change cpu.instructionPointer to `rip` - containing "the address of the next instruction to be executed if no branching is done"
- [x] Implement comments

## Usage

```javascript
var x64 = require('x64js');

var cpu = x64.aBlankCpu();
cpu = x64.loadProgramFromFile(cpu, './hello-world.asm');
cpu = x64.stepProgramOnce(cpu);
```

## Assumptions

- This cpu can only hold one program in memory at a time.
- There is no operating system.

## Goals

- To be able to feed this module a reasonably simple NASM file and have it produce the expected output.

## Style and Structure

- This is intentionally coded in a functional style, leaving the management of state up to you.

## Reference

- [Intel 80x86 Assembly Language OpCodes (mathemainzel.info)](http://www.mathemainzel.info/files/x86asmref.html#mov)
- [x86 Assembly Guide (cs.virginia.edu)](http://www.cs.virginia.edu/~evans/cs216/guides/x86.html)
- [Say hello to x64 Assembly (0xax.blogspot.com)](http://0xax.blogspot.com/2014/08/say-hello-to-x64-assembly-part-1.html)

## Other cool things

- [ebradbury/assembly-adventures (github.com)](https://github.com/ebradbury/assembly-adventures/blob/master/strlen-args.asm)

## Random tips

- In `[rax*2]`, the square brackets act just like the C `*` dereference operator. In this case, if `rax` held a pointer (let's say `4`), the interpreter would calculate `4*2` and then dereference whatever was in memory address `8`.
