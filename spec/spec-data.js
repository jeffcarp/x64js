var specData = module.exports = {};
var fs = require('fs');

specData.tinyProgram = function() {
  var path = __dirname + '/data/tiny-program.asm';
  var str = fs.readFileSync(path, 'utf8');
  var notEmpty = function(x) { return x.length > 0;};
  var program = str.split('\n').filter(notEmpty);
  return program;
};
