#!/usr/bin/env node
/* 主要是在于命令行的逻辑 */
var pathFn = require('path')
var shorid = require('shortid')
var fs = require('fs');
var Promise = require('bluebird')
var check_in_out_data = require('./check_in_out_data.js')
var zip = require('../lib/zip.js')
var req = require('./request.js')

var argv  = require('yargs')
            .alias('s','src')
            .alias('u','uid')
            .alias('t','time')
            .alias('m','memroy')
            .help('h')
            .alias('h','help')
            .argv

var c_dir = process.cwd()

/* 常用函数 */

var exists = fs.existsSync;
var extname =  pathFn.extname;

//console.log(argv.s)
//console.log(exists(argv.s))
/* 上传文件 -- 永久 */

//代码评测
function judge_src(){
    if(!exists(argv.s)){
        console.log('代码文件不存在')
        return ;
    }

    //检查文件名后缀
    var ext = extname(argv.s)
    var max_memory = 128*1024*1024;
    var max_cpu_time = 1000;
    if( ext != '.cpp' ){
        console.log('现在只能使用cpp文件')
        return ;
    }

    if(!argv.t){
        console.log('没有使用 -t 设定时间,使用默认时间 1s')
    }
    else if( argv.t <1 || argv.t >10){
        console.log('-t 参数不正确 最大 10s,最小 1s')
        return;
    }
    else {
        max_cpu_time = argv.t *1000
        console.log('设定时间为 %d s',max_cpu_time);
    }

    if(!argv.m){
        console.log('没有使用 -m 设定内存,使用默认内存 128m')
    }
    else if( argv.m <16 || argv.m >512){
        console.log('-m 参数不正确 最大 512mb,最小 16mb')
        return;
    }
    else{
        max_memory = argv.m*1024*1024
        console.log('设定内存为 %d mb',max_memory);
    }


    var __config = {
        src:fs.readFileSync(argv.s),
        language:'cpp',
        uid:argv.u,
        tmp_uid:shorid.generate(),
        max_cpu_time:max_cpu_time,
        max_memory:max_memory,
        output:false
    }
    return req.get_judge(__config)
        .then(function(result){
            console.log(result)
        })
}

/* 上传永久文件 */
function judge_upload(){
    if(!argv.u){
        console.log('需要 uid')
        return;
    }
    if(!exists(argv.p)){
        console.log('data.zip 文件不存在')
        return;
    }
    else if( extname(argv.p) !== '.zip'){
        console.log('不是zip文件')
        return;
    }

    return zip.ziplist(argv.p)
            .then(function(files){
                if(!check_in_out_data(files))
                    return Promise.reject(argv.p+'\n里的数据文件名格式不对\n'+ files.join('\n'))
            })
            .then(function(){   //上传文件
                return req.postFile(argv.u,argv.p)
            })
            .then(function(result){
                console.log(result)
            })
            .catch(function(e){
                console.log(e)
            })
}

if( argv.s) //代码评测
    judge_src();
else if( argv.upload)
    judge_upload();
else if( argv.tmp)
    judge_tmp();
else {
    console.log('参数不正确')
}
