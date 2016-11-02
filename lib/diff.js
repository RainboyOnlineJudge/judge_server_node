var fs = require('./fs.js');
var Promise =require('bluebird');
var difflib = require('difflib');
var cdiff = difflib.contextDiff;
var config = require('../config.js')

var readfile = fs.readfile;
var basename = require('path').basename;


function diff(in_path,out_path){
    return Promise.map([in_path,out_path],function(path){
        return readfile(path,{encoding:'utf8'});
    })
    .then(function(data){
        return cdiff(
            data[0].trim().split('\n'),
            data[1].trim().split('\n'),
            {
                fromfile:basename(in_path),
                tofile:basename(out_path),
                lineterm:''
            }
        ).slice(0,config['max_diff_line']).join('\n');//最多显示多少行
    })
}

module.exports = diff
