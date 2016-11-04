var fs = require('./fs.js');
var Promise =require('bluebird');
var difflib = require('difflib');
var cdiff = difflib.contextDiff;
var config = require('../config.js')

var readLine = fs.readLine;
var basename = require('path').basename;


function diff(in_path,out_path){ 
    return Promise.map([in_path,out_path],function(path){
        return readLine(path,config.max_diff_line);
    })
    .then(function(data){
        return cdiff(
            data[0],
            data[1],
            {
                fromfile:basename(in_path),
                tofile:basename(out_path),
                lineterm:''
            }
        ).join('\n');//最多显示多少行
    })
}

module.exports = diff
