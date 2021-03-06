var express  = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var Promise  =require('bluebird')
var schedule = require('node-schedule')
var pathFn = require('path');
var mkdirp = require('mkdirp');
var queuefun  = require('queue-fun')
var config = require('./config.js');


var judge = require('./lib/judge.js')



var myfs   = require('./lib/fs.js')
var fs     = require('fs');
var shortid= require('shortid');
var app = express();


/* ------lib---- */
var unzip = require('./lib/zip.js').unzip;

/* global function */
var join = pathFn.join;
var _Queue = queuefun.Queue(Promise);
var Queue  = new _Queue(100);


app.use(logger('dev'));
app.use(bodyParser.json({limit: '50mb'})); // 限制上传5M
app.use(bodyParser.urlencoded({ extended: false , limit: '50mb' }));

/* judger server version  */
app.get('/ping',function(req,res){
    res.json({ 
        Judger_version: config.version
    });
})

/* 传方件 */
/* 头文件设置好type 和 uid 两个字段 */
app.post('/tmpfile',function(req,res){
    var type = req.headers.type;
    var uid  = req.headers.uid;

    var path =  join(config['tmp_prefix'],uid);
    mkdirp.sync(path);

    var filePath = '';

    if(type =='.zip')
        filePath = join( path,'data.zip');
    else{
        res.json({
            state:'fail',
            msg:'do not support this type'
        })
    }
    var w = fs.createWriteStream(filePath);
    req.pipe(w);

    req.on('end',function(){
        //解压zip
        if(type == '.zip'){

            //var date = new Date(Date.now+30*60*1000);
            //var j = schedule.scheduleJob( date,function(){

                //if( fs.existsSync(path)){
                    //myfs.rmdir(path);
                    //console.log('删除超时文件夹: '+ path);
                //}
            //})
            //return unzip(filePath,path)
                    //.then(function(){
                        //fs.unlink(filePath);
                        //res.json({
                            //state:'success',
                            //uid:uid
                        //});
                    //})
            res.json({
                state:'success',
                uid:uid
            })
        }
        else
            res.json({
                state:'fail',
                uid:uid
            });
    })
})


app.post('/file',function(req,res){
    var type = req.headers.type;
    var uid  = req.headers.uid;

    var path =  join(config['prefix'],uid);
    mkdirp.sync(path);

    var filePath = '';

    if(type =='.zip')
        filePath = join( path,'data.zip');
    else{
        res.json({
            state:'fail',
            msg:'do not support this type'
        })
    }

    var w = fs.createWriteStream(filePath);

    req.pipe(w);

    req.on('end',function(){
        //解压zip
        if(type == '.zip'){
            res.json({
                state:'success',
                uid:uid
            });
        }
        else
            res.json({
                state:'success',
                uid:uid
            });
    })
})



/* judger */
app.post('/judge',function(req,res){
    
    var body = req.body;        //得到请求参数
    var judgerConfig = {};
    var uid=''; //data数据文件
    var tmp_uid='';
    var output = false;
    var language = '';

    function returnError(res,arg){
        res.json({
            state:'fail',
            msg:'need '+ arg +' args'
        })
    }
    if( body.uid )
        uid = body.uid;
    else
        returnError(res,'uid');

    if( body.max_cpu_time)
        judgerConfig.max_cpu_time = body.max_cpu_time;
    else
        returnError(res,'max_cpu_time');

    if(body.max_memory)
        judgerConfig.max_memory = body.max_memory;
    else
        returnError(res,'max_memory');

    if(body.tmp_uid)
        tmp_uid = body.tmp_uid;
    else
        returnError(res,'tmp_uid');

    if(body.language)
        language= body.language;
    else
        returnError(res,'language');

    if(body.output)
        output=true;

    
    var data_path = '';
    var code_path = '';
    var out_path  = '';

    data_path = join(config.tmp_prefix,tmp_uid);
    code_path = join(config.tmp_prefix,tmp_uid,'main.'+language);
    out_path  = join(config.tmp_prefix,tmp_uid,'out');
    
    mkdirp.sync(out_path);
    fs.chownSync(data_path,config.compiler_uid,config.compiler_gid);

    function do_judger(c_path,s_src){

        var d_path = '';
        return myfs.writeFile(c_path,s_src) //写入代码代码
            .then(function(){   //如果tmp_uid !==  uid 那么 复制->解压 else 直接解压
                if(tmp_uid !== uid){
                    var s_path = join(config.prefix,uid,'data.zip');
                    var d_path = join(config.tmp_prefix,tmp_uid,'data.zip');
                    return myfs.copyFile(s_path,d_path);
                }
            })
            .then(function(){//解压
                d_path = join(config.tmp_prefix,tmp_uid,'data.zip');
                return unzip(d_path,data_path)
            })
            .then(function(){
                fs.unlink(d_path)
                return judge(data_path,out_path,code_path,language,judgerConfig,output)
            })
            .then(function(data){
                res.json(data)
            })
    }

    Queue.go(do_judger,[code_path,body.src])
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: {}
  });
});

module.exports = app;
