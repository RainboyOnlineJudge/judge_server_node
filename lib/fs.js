/* 
 *  1.创建文件夹
 *  2.创建文件
 *  3.删除文件夹和里面所有的东西
 * */

var fs = require('fs');
var pathFn = require('path');
var rimraf = require('rimraf');
var mkdirp = require('mkdirp')
var Promise = require('bluebird');
var md5 =require('md5');

var join = require('path').join;

var readDir = Promise.promisify(fs.readdir);

var readfile = Promise.promisify(fs.readFile);

/* 创建文件夹 */
var mkdir =function(path){
    if(path === undefined) throw new TypeError('path require String!');
    
    /* 是不是一个文件 */
    var real_path = '';
    if(pathFn.extname(path) !== '')
        real_path = pathFn.dirname(path);
    else
        real_path=path;
    /* 创建文件夹 */
    return new Promise(function(resolve,recject){
        mkdirp(real_path,function(err){
            if(err)
                recject(err);
            else
                resolve();
        });
    });
}


/* 创建文件 */
var writeFile = function(path,data,encoding){
    if(path === undefined) throw new TypeError('path require String!');
    var encode = encoding || 'utf8';
    /* 是不是一个文件 */

    return new Promise(function(resolve,recject){
        fs.writeFile(path,data,{encoding:encode},function(err){
            if(err)
                recject(err);
            else
                resolve();
        });
    });
}

var rmdir = function(path){
    return new Promise(function(resolve,recject){
        rimraf(path,function(err){
            if(err)
                recject(err);
            else
                resolve();
        });
    });
}

var file_judger = function(in_file,out_file){
    var in_str = fs.readFileSync(in_file,{encoding:'utf8'}).trim();
    var out_str = fs.readFileSync(out_file,{encoding:'utf8'}).trim();
    return ( md5(in_str) ===md5(out_str));
}

function listDir(path){
    return readDir(path)
        .filter(function(item){
            return (/((.in)|(.out))$/.test(item))
        })
        .map(function(item){
            return join(path,item);
        })
}


exports.mkdir = mkdir;
exports.writeFile= writeFile;
exports.rmdir = rmdir;
exports.file_judger = file_judger;
exports.listDir = listDir;
exports.readfile = readfile
