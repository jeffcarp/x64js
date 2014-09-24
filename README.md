This is an attempt to create a toy CPU acting as an interpreter for a subset of the x86\_64 instruction set in JavaScript.

## TODO

- [ ] Implement the 13 instructions stubbed in `test/test.js`
- [x] Implement labels (could be improved)
- [ ] Implement `db` and `dd` pseudo-instructions (from nasm)
- [ ] Implement `section .text` with `global` keyword
- [ ] Implement `eip` containing "the address of the next instruction to be executed if no branching is done" 

## Run tests

```bash
npm test
```

## Reference

- [Intel 80x86 Assembly Language OpCodes (mathemainzel.info)](http://www.mathemainzel.info/files/x86asmref.html#mov)
- [x86 Assembly Guide (cs.virginia.edu)](http://www.cs.virginia.edu/~evans/cs216/guides/x86.html)
- [Say hello to x64 Assembly (0xax.blogspot.com)](http://0xax.blogspot.com/2014/08/say-hello-to-x64-assembly-part-1.html)

## Other cool things

- [ebradbury/assembly-adventures (github.com)](https://github.com/ebradbury/assembly-adventures/blob/master/strlen-args.asm)
