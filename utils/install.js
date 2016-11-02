/* 把当前路径加入到bash */
var fs = require('fs');

var dirname  = require('path').dirname

var n_path = process.cwd();
var bash_path = 
var t_str = fs.readFileSync(bash_path,{encoding:'utf8'})

var bak_path = dirname(bash_path)
