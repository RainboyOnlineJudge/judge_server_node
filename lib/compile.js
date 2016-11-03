/* 
 *  调用judger 对文件进行编译
 * */

var config = require('../config.js')
var Promise = require('bluebird')
var judger = require('./Promise_judger.js')
var pathFn = require('path');
var fs  = require('fs')


var join = pathFn.join;
var dirname = pathFn.dirname;

/* 默认的CPP编译 */
var default_config = {
    max_cpu_time :config.max_compile_time || 1000,
    max_real_time :10*config.max_compile_time || 3000,
    max_memory : config.max_compile_memory || 128*1024*1024,
    max_process_number:config.max_compile_process_number || 4,
    max_output_size:config.max_compile_output_size|| 2*1024*1024,
    exe_path: '/usr/bin/g++',
    input_path:'/dev/null',
    output_path:'/dev/null',
    error_path:'/dev/null',
    args:[],
    env:["PATH=/usr/bin"],
    log_path:config.compile_log_path,
    seccomp_rule_name:null,
    gid:config.compiler_gid,
    uid:config.compiler_uid,
}


/* 对文件进行compile */
function _compile_(str_path,out_path,language){
    var cpp_config  = JSON.parse ( JSON.stringify(default_config));
    var err_log_path = join( dirname(str_path),'err_log')
    cpp_config.error_path = err_log_path;

    if(language == 'cpp'){
        cpp_config.exe_path = config.cpp_compile_path;
        cpp_config.args=[
            str_path,
            '-o',
            out_path,
            '-lm',
        ];
    }
    else if(language == 'c'){
        cpp_config.exe_path = config.c_compile_path;

        cpp_config.args=[
            str_path,
            '-o',
            out_path,
            '-lm',
        ];
    }
    else if(language == 'pas'){
        cpp_config.exe_path = config.pas_compile_path;
        cpp_config.args=[
            str_path,
            '-o',
            out_path,
            '-lm',
        ];
    }
    else {
        return Promise.reject({
            err:'',
            msg:'do not support this language: '+language,
        })
    }

    return judger(cpp_config)
        .then(function(result){
            if( result.result.result !==0 )//编译错误
            {
                return Promise.reject({
                    err:'compile error',
                    msg:fs.readFileSync(err_log_path,{encoding:'utf8'})
                })
            }
        })
}


module.exports = _compile_
