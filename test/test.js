var should = require('should') 
var request = require('request')
var shortid = require('shortid')
var postFile = require('../lib/postFile.js')
var config  = require('../config.js')
var fs      =require('fs')


var judge_address = 'http://127.0.0.1'

var pathFn = require('path');
var join = pathFn.join;
var ext = pathFn.extname;

var n_path = join( process.cwd(),'test')

function out_cotent(file_path){
    return fs.readFileSync(file_path,{encoding:'utf8'});
}

describe('文件上传测试',function(){

    var uid = shortid.generate();

    it('zip上传',function(done){
        postFile(uid,join(n_path,'test.zip'),'.zip',judge_address+':'+config.port+'/file')
            .then(function(result){
                result.state.should.eql('success');
                result.uid.should.eql(uid);
                //var out = 'hello world!\nhello world!\n';
                //out.should.eql( out_cotent( join(config.prefix,uid,'1.in')));
                //out = 'hello Rainboy!\n';
                //out.should.eql( out_cotent( join(config.prefix,uid,'1.out')));
                done();
            })
    })
})

describe('简单代码评测测试',function(){
    var codepath =join(n_path,'cpp','1','hello.cpp');
    var datazip=join(n_path,'cpp','1','data.zip');
    var configPath = join(n_path,'cpp','1','config.json');
    var t_config =    JSON.parse( fs.readFileSync(configPath));
    var uid= shortid.generate();
    it('zip上传',function(done){
        postFile(uid,datazip,'.zip',judge_address+':'+config.port+'/tmpfile')
            .then(function(result){
                result.state.should.eql('success');
                result.uid.should.eql(uid);
                done();
            })
    })

    it('helloworld编译测试',function(done){
        this.timeout(15000)
        var src = fs.readFileSync(codepath);
        var __config = {
            src:src,
            language:'cpp',
            uid:uid,
            tmp_uid:uid,
            max_cpu_time:t_config.max_cpu_time,
            max_memory:t_config.max_memory,
            output:false
        }
        request.post({url:judge_address+':'+config.port+'/judge',form:__config,json:true},
            function(err,res,body){
                console.log(body)
                done()
            })
    })
})

//describe('代码评测测试',function(){

    //var codepath =join(n_path,'cpp','2','aplusb.cpp');
    //var datazip=join(n_path,'cpp','2','data.zip');
    //var configPath = join(n_path,'cpp','2','config.json');
    //var t_config =    JSON.parse( fs.readFileSync(configPath));
    //var uid= shortid.generate();

    //it('zip上传',function(done){
        //postFile(uid,datazip,'.zip','http://127.0.0.1:'+config.port+'/tmpfile')
            //.then(function(result){
                //result.state.should.eql('success');
                //result.uid.should.eql(uid);
                //done();
            //})
    //})

    //it('a+b编译测试',function(done){
        //this.timeout(15000)
        //var src = fs.readFileSync(codepath);
        //var __config = {
            //src:src,
            //language:'cpp',
            //uid:uid,
            //tmp_uid:uid,
            //max_cpu_time:t_config.max_cpu_time,
            //max_memory:t_config.max_memory,
            //output:false
        //}
        //request.post({url:'http://127.0.0.1:'+config.port+'/judge',form:__config,json:true},
            //function(err,res,body){
                //console.log(body)
                //done()
            //})
    //})
//})
