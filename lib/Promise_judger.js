/* 对judge 的一层Promise一层封装 */

var _judger = require('judge_node/father.js')
var Promise = require('bluebird');

function judger(config){
    return new Promise(function(resolve,recject){
            _judger(config,resolve);
    })
}

module.exports = judger;
