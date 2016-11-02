module.exports = {
    port:3100,           //本judger server 端口
    tmp_prefix:'/test',      //临时评测的时候 前缀 + uuid
    prefix:'/test',      //评测的时候 前缀 + uuid
    max_diff_line:100,//最多返回多少的行的数据
    //----测试
    
    /* 编译设置 */
    max_compile_time:3000,
    max_compile_memory:-1,
    max_compile_process_number:-1,
    max_compile_output_size:2*1024*1024,
    compile_log_path:'/tmp/compile_log',

    max_process_number:4,
    max_output_size:5*1024*1024,
    gid:65534,
    uid:65534,

    cpp_compile_path:'/usr/bin/g++',
    c_compile_path:'/usr/bin/gcc',
    pas_compile_path:'/usr/bin/pas',

    judger_log:'/test/judger_log.txt', //评测日志
    //评测机版本
    version:'0.0.2'
}
