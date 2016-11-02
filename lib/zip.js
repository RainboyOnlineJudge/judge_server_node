/* 
 *  create by Rainboy at 2016-10-26 08:49
 *  unzip
 *  listzip
 *  */


var decompressZip = require('decompress-zip');
var Promise = require('bluebird')
var extname = require('path').extname

function unzip(file_path,out_path){
    return new Promise(function(resolve,recject){
        var unzipper = new decompressZip(file_path);

        unzipper.on('error',function(err){
            recject(err);
        })

        unzipper.on('extract',function(){
            resolve();
        })

        unzipper.extract({
            path:out_path,
            filter:function(file){
                var ext = extname(file.filename)
                return (ext =='.in' || ext == '.out')
            }
        })
    })
}

function ziplist(file_path){
    return new Promise(function(resolve,recject){
        var zipperlist = new decompressZip(file_path);

        zipperlist.on('error',function(err){
            recject(err);
        })
        
        zipperlist.on('list',function(files){
            resolve(files)
        })

        zipperlist.list()
    })
}

exports.unzip = unzip
exports.ziplist = ziplist
