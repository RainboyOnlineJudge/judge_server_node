/* 
 * create_by Rainboy at 2016-10-26 17:29
 * 
 * 得到数据文件夹中的.in .out 的列表
 *  */
var fs      = require('./fs.js');
var Promise = require('bluebird');
const ext   = require('path').extname;
const basename   = require('path').basename;


function data_path_info(path){
    var Info = {};
    Info.inputs   =[];
    Info.outputs  =[];

    return fs.listDir(path)
        .reduce(reduceFiles,Info)
        .then(function(){
            /* check inputs and outputs */
            if(Info.inputs.length == 0)
                return Promise.reject({
                    err:'',
                    msg:'do not have inputs data'
                })

            if(Info.outputs.length == 0)
                return Promise.reject({
                    err:'',
                    msg:'do not have outputs data'
                })

            for(var i=0;i<Info.inputs.length;i++){
                if(Info.inputs[i] == null)
                    return Promise.reject({
                        err:'',
                        msg:'inputs data index is not serise',
                    })
            }

            for(var i=0;i<Info.outputs.length;i++){
                if(Info.outputs[i] == null)
                    return Promise.reject({
                        err:'',
                        msg:'outputs data index is not serise',
                    })
            }
            return Info;
        })
}


function reduceFiles(result,item){

    if( ext(item) == '.out'){
        var name = basename(item);
        var index = parseInt( name.substring(0,name.length-4) );
        result.outputs[index] = item;
        return result;
    }
    else if ( ext(item) == '.in'){
        var name = basename(item);
        var index = parseInt( name.substring(0,name.length-3) );
        result.inputs[index] = item;
        return result;
    }
}


module.exports = data_path_info;

