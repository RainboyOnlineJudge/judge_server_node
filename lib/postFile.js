var request  = require('request')
var Promise = require('bluebird')
var fs = require('fs')


/* 默认配置 */

function postFile(uid,file_path,type,url){
    return new Promise(function(resolve,recject){

        var opt= {
            url:url,
            headers:{
                uid:uid,
                type:type,
            },
            method:'POST',
            json:true
        }

        var readStream = fs.createReadStream(file_path);

        readStream.on('error',function(err){
            recject(err);
        })
        readStream.pipe(
            request.post(opt,function(err,res,body){
                if(err)
                    recject(err);
                else if( body.state == 'success')
                    resolve(body);
                else {
                    recject(body);
                }
            })
        )
    })
}

module.exports = postFile;
