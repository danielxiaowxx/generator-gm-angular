'use strict';
var path = require('path');
var fs = require('fs');

function escapeRegExp (str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
}

function rewrite (args) {
  /* jshint -W044 */
  // check if splicable is already in the body text
  var re = new RegExp(args.splicable.map(function (line) {
    return '\s*' + escapeRegExp(line);
  }).join('\n'));

  if (re.test(args.haystack)) {
    return args.haystack;
  }

  var lines = args.haystack.split('\n');

  var otherwiseLineIndex = 0;
  lines.forEach(function (line, i) {
    if (line.indexOf(args.needle) !== -1) {
      otherwiseLineIndex = i;
    }
  });

  var spaces = 0;
  while (lines[otherwiseLineIndex].charAt(spaces) === ' ') {
    spaces += 1;
  }

  var spaceStr = '';
  while ((spaces -= 1) >= 0) {
    spaceStr += ' ';
  }

  /**
   * 追加到该行的开始部分: args.isAppend=true args.appendHead
   * 追加到该行的末尾部分: args.isAppend=true args.appendTail
   * 插入到该行的前面一行: args.insertPrev=true
   * 追加到该行的后面一行: default
   */
  if (args.isAppend) { // 追回到该行
    if (args.appendAfter) {
      lines[otherwiseLineIndex] += args.splicable.join('');
    } else {
      lines[otherwiseLineIndex] = args.splicable.join('') + lines[otherwiseLineIndex];
    }
  } else { // 插入新行
    var n = args.insertPrev ? 0 : 1;
    lines.splice(otherwiseLineIndex + n, 0, args.splicable.map(function (line) {
      return spaceStr + line;
    }).join('\n'));
  }


  return lines.join('\n');
}

function rewriteFile (args) {
  args.path = args.path || process.cwd();
  var fullPath = path.join(args.path, args.file);

  args.haystack = fs.readFileSync(fullPath, 'utf8');
  var body = rewrite(args);

  fs.writeFileSync(fullPath, body);
}

module.exports = {
  rewrite: rewrite,
  rewriteFile: rewriteFile
};
