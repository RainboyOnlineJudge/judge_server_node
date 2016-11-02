/* 对judge 的一层Promise一层封装 */


var _judger = require('judger').judger;
var Promise = require('bluebird');

function judger(config){
    return new Promise(function(resolve,recject){
            _judger(config,function(err,result){
                if(err)
                    recject(err);
                else
                    resolve(result);
            })
    })
}

module.exports = judger;
