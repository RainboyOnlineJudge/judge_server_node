var extname = require('path').extname;
var dirname = require('path').dirname;
var Promise = require('bluebird');

var file_reg = /((.out)|(.in))$/;


function check_in_out_data(list){
    var in_list=[];
    var out_list=[];
    for(var i =0;i<list.length;i++){
        if( file_reg.test(list[i])  && dirname(list[i]) == '.' ){
            if(extname(list[i]) == '.out'){
                var index  = parseInt( list[i].substring(0,list[i].length-4));
                out_list[index] = list[i];
            }
            else{
                var index  = parseInt( list[i].substring(0,list[i].length-3));
                in_list[i] = list[i];
            }

        }
        else {
            return false
        }
    }

    if( in_list.length !== out_list.length)
        return false

    for(var i =0;i<in_list.length;i++){
        if( in_list[i] == null || out_list[i] == null)
            return false;
    }

    return true;
}

module.exports = check_in_out_data;
