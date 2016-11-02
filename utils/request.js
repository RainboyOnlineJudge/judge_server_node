/* 和judge_server进行网络交互 */

/* 上传文件 */
var Promise = require('bluebird');
var postFile = require('../lib/postFile.js')
var request = require('request')
var config = require('./config.js')


function _postFile(uid,file_path){
    var url = config.url+':'+config.port+'/file'
    return postFile(uid,file_path,'.zip',url);
}


/* 请求测评 */
//var __config = {
    //src:src,
    //language:'cpp',
    //uid:uid,
    //tmp_uid:uid,
    //max_cpu_time:t_config.max_cpu_time,
    //max_memory:t_config.max_memory,
    //output:false
//}

function get_judge(__config){
    return new Promise(function(resolve,reject){
        request.post({url:config.url +':'+config.port+'/judge',form:__config,json:true},
            function(err,res,body){
                if(err)
                    reject(err)
                else 
                    resolve(body);
            })
    })
}

exports.get_judge = get_judge
exports.postFile = _postFile
