

/* 
 * 接收:评测结果的一个数组,返回一个分析后的数组
 * ex:
 *
[ { cpu_time: 1,
    memory: 1331200,
    real_time: 0,
    signal: 10,
    flag: 5,
    exit_status: 0 },
  { cpu_time: 1,
    memory: 1335296,
    real_time: 1,
    signal: 10,
    flag: 5,
    exit_status: 0 },
  { cpu_time: 1,
    memory: 1335296,
    real_time: 0,
    signal: 10,
    flag: 5,
    exit_status: 0 } ]
 * */

/* 
 *
    Accepted: 你的答案符合判题标准
    Runtime Error: 你的程序运行时出现错误（指针越界，栈溢出，有未处理的异常，主函数返回值非零等）
    Time Limit Exceeded: 你的程序执行时间超出题目要求
    Memory Limit Exceeded: 你的程序内存使用超出题目要求
    Compile Error: 你的程序在编译（包括链接）时出现错误
    Wrong Answer: 你的程序输出的答案不符合判题标准
    System Error: 判题系统发生故障，请等待重判
    Waiting: 你的提交正在等待处理
 *
 * */
/*
 *#define CPU_TIME_LIMIT_EXCEEDED 1
 *#define REAL_TIME_LIMIT_EXCEEDED 2
 *#define MEMORY_LIMIT_EXCEEDED 3
 *#define RUNTIME_ERROR 4
 *#define SYSTEM_ERROR 5
 */

var fs = require('./fs.js');
var file_judger = fs["file_judger"];//文件判断,最简单

function analyse(result_obj,real_memory_limit,in_array,out_array){

    var result = [];
    for(var i=0; i< result_obj.length;i++){
        var tmp = result_obj[i];
        if(tmp['flag'] === 0){// no error
            if( file_judger(in_array[i],out_array[i]))
                result[i] = {r:'A',t:tmp['cpu_time'],m:tmp['memory']};
            else
                result[i] = {r:'W',t:tmp['cpu_time'],m:tmp['memory']};

        }
        else if( tmp['flag'] === 1 || tmp['flag'] === 2 )
                result[i] = {r:'T',t:tmp['cpu_time'],m:tmp['memory']};
        else if(tmp['flag'] === 3 || tmp['memory'] >real_memory_limit )
                result[i] = {r:'M',t:tmp['cpu_time'],m:tmp['memory']};
        else if(tmp['flag'] === 4 )
                result[i] = {r:'R',t:tmp['cpu_time'],m:tmp['memory']};
        else if(tmp['flag'] === 5 )
                result[i] = {rt:'S',t:tmp['cpu_time'],m:tmp['memory']};
        else 
            result[i] = {result:'U',t:tmp['cpu_time'],m:tmp['memory']};
    }

    return result;
}

module.exports = analyse;
