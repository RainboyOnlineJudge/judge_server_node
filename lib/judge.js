/* 
 * create by Rainboy at 2016-10-26 13:35
 * 
 * 对uid文件下的数据进行评测
 * 
 *  */
var Promise = require('bluebird')
var config = require('../config.js')
var pathFn = require('path')
var _judger = require('./Promise_judger.js')
var compile = require('./compile.js')
var data_list =  require('./data_path_info.js') // 得到数据列表

var myfs = require('./fs.js')

var diff = require('./diff.js')
var join = pathFn.join;
var dirname = pathFn.dirname;



function judge(data_path,out_path,code_path,language,judgerConfig,output){
    var default_config ={
        max_cpu_time : judgerConfig.max_cpu_time || 1000,
        max_real_time : judgerConfig.max_cpu_time>0?5*judgerConfig.max_cpu_time:judgerConfig.max_cpu_time,
        max_memory : judgerConfig.max_memory || 128*1024*1024,
        max_process_number:judgerConfig.max_process_number || config.max_process_number,
        max_output_size: judgerConfig.max_output_size || config.max_output_size,
        exe_path: join( dirname(code_path),'main'),
        input_path:'/dev/null',
        output_path:'/dev/null',
        error_path:'/dev/null',
        args:[],
        env:[],
        log_path: config.judger_log||'judger_test.log',
        seccomp_rule_name: (language == 'cpp' || language =='c')?'c_cpp':'general',
        //seccomp_rule_name:null,
        gid:config.nobody_gid,
        uid:config.nobody_uid
    }

    var judgerResult = [];
    var compile_out = join( dirname(code_path),'main');
    var input_list=[];
    var output_list =[];

    return compile(code_path,compile_out,language) //第一步 编译
            .then(function(){   //得到data_path里的in,out,文件列表
                var info = data_list(data_path);
                return info;
            })
            .then(function(Info){
                console.log(Info)
                input_list = Info.inputs;
                output_list = Info.outputs;
            })
            .then(function(){   //评测
                return Promise.each(input_list,function(item,index){
                    var tmpConfig = JSON.parse( JSON.stringify(default_config));
                    tmpConfig['input_path'] = item;
                    tmpConfig['output_path'] = join(out_path,index+'.out');
                    var t_result ={}
                    return _judger(tmpConfig)
                        .then(function(result){ //对结果进行分析
                            t_result.cpu_time = result.result.cpu_time;
                            t_result.result   = result.result.result;
                            t_result.memory = result.result.memory
                            t_result.signal = result.result.signal
                            t_result.error  = result.result.error
                            if (t_result.result == 0 ){ //diff
                                return diff(output_list[index],tmpConfig['output_path'])
                                        .then(function(diff_str){
                                            if(diff_str.length !== 0 ){
                                                t_result.detail = diff_str;
                                                judgerResult[index] = t_result;
                                            }
                                            else{
                                                judgerResult[index] = t_result;
                                            }
                                        })
                            }
                            else {
                                judgerResult[index] = t_result;
                            }
                        })
                },{concurrency:5});
            })
            .then(function(){
                myfs.rmdir(data_path)
                return judgerResult
            })
            .catch(function(e){
                myfs.rmdir(data_path)
                return e
            })
}



module.exports = judge
