An attempt to create a toy CPU emulating a subset of the x86\_64 instruction set in JavaScript.

## TODO

- [ ] Implement the 13 instructions stubbed in `test/test.js`
- [x] Implement labels (could be improved)
- [ ] Implement `db` and `dd` pseudo-instructions (from nasm)
- [ ] Implement `section .text` with `global` keyword

## Run tests

```bash
npm test
```

## Reference

- [Intel 80x86 Assembly Language OpCodes (mathemainzel.info)](http://www.mathemainzel.info/files/x86asmref.html#mov)
- [x86 Assembly Guide (cs.virginia.edu)](http://www.cs.virginia.edu/~evans/cs216/guides/x86.html)

## Other cool things

- [ebradbury/assembly-adventures (github.com)](https://github.com/ebradbury/assembly-adventures/blob/master/strlen-args.asm)
