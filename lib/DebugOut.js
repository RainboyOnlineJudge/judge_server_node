//  输出debug 信息
var printf = require('printf')
var chalk  = require('chalk')
var isDebug= require('../config.js').debug


const mh         = chalk.cyan(':')
const result_str = chalk.bgGreen('[ result ]') +mh


function debugOut(){
    if( isDebug){
        var formatStr  = printf.apply(this,arguments);
        console.log( result_str + formatStr)
    }
}
module.exports = debugOut;
